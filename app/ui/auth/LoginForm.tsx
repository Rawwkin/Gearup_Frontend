"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { ApiError, getErrorMessage } from "@/lib/http";
import { ROLE_HOME } from "@/lib/constants";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toLoginMessage = (error: unknown): string => {
  // The backend answers an unknown email with a raw Prisma "record not found" (404)
  // and a wrong password with "Password does not match!" — show one friendly message.
  if (error instanceof ApiError && error.status === 404) return "Incorrect email or password.";
  const message = getErrorMessage(error, "Unable to sign in.");
  if (/password does not match/i.test(message)) return "Incorrect email or password.";
  return message;
};

const LoginForm = ({ next }: { next: string | null }) => {
  const router = useRouter();
  const toast = useToast();
  const { login, user, status } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in (e.g. opened /login in a second tab) — go where they belong.
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(next ?? ROLE_HOME[user.role]);
    }
  }, [status, user, next, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const signedIn = await login({ email: email.trim(), password });
      toast.success(`Welcome back, ${signedIn.name.split(" ")[0]}!`);
      router.replace(next ?? ROLE_HOME[signedIn.role]);
    } catch (error) {
      setFormError(toLoginMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <Alert variant="error">{formError}</Alert>}
      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
        required
      />
      <Button type="submit" fullWidth size="lg" loading={submitting}>
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
