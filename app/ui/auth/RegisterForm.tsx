"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ShoppingBag } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { getErrorMessage } from "@/lib/http";
import { ROLE_HOME } from "@/lib/constants";
import { isHttpUrl } from "@/lib/format";
import { cn } from "@/lib/cn";

type AccountType = "CUSTOMER" | "PROVIDER";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const accountTypes: { value: AccountType; title: string; description: string; icon: typeof Briefcase }[] = [
  {
    value: "CUSTOMER",
    title: "I want to rent gear",
    description: "Browse, book and review gear.",
    icon: ShoppingBag,
  },
  {
    value: "PROVIDER",
    title: "I want to list gear",
    description: "Earn by renting out your gear.",
    icon: Briefcase,
  },
];

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  profileImage?: string;
}

const RegisterForm = ({
  initialRole,
  next,
}: {
  initialRole: AccountType;
  next: string | null;
}) => {
  const router = useRouter();
  const toast = useToast();
  const { register, login } = useAuth();

  const [role, setRole] = useState<AccountType>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FieldErrors => {
    const result: FieldErrors = {};
    if (name.trim().length < 2) result.name = "Enter your full name.";
    if (!EMAIL_PATTERN.test(email.trim())) result.email = "Enter a valid email address.";
    if (password.length < 8) result.password = "Use at least 8 characters.";
    if (confirmPassword !== password) result.confirmPassword = "Passwords do not match.";
    if (profileImage.trim() && !isHttpUrl(profileImage.trim())) {
      result.profileImage = "Enter a full image URL starting with http:// or https://.";
    }
    return result;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(profileImage.trim() ? { profileImage: profileImage.trim() } : {}),
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to create your account.");
      if (/email already exist/i.test(message)) {
        setErrors({ email: "An account with this email already exists." });
      } else {
        setFormError(message);
      }
      setSubmitting(false);
      return;
    }

    // Account created — sign the user straight in.
    try {
      const signedIn = await login({ email: email.trim(), password });
      toast.success("Your account is ready. Welcome to GearUp!");
      router.replace(next ?? ROLE_HOME[signedIn.role]);
    } catch {
      toast.success("Account created. Please sign in.");
      router.replace("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <Alert variant="error">{formError}</Alert>}

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-slate-700">Account type</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {accountTypes.map(({ value, title, description, icon: Icon }) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                role === value
                  ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                  : "border-slate-300 bg-white hover:border-slate-400",
              )}
            >
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="sr-only"
              />
              <Icon
                className={cn("mt-0.5 size-5 shrink-0", role === value ? "text-brand-700" : "text-slate-500")}
                aria-hidden="true"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{title}</span>
                <span className="block text-xs text-slate-600">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
        required
      />
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint="At least 8 characters."
          required
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          required
        />
      </div>
      <Input
        label="Profile image URL (optional)"
        type="url"
        name="profileImage"
        inputMode="url"
        value={profileImage}
        onChange={(event) => setProfileImage(event.target.value)}
        error={errors.profileImage}
        placeholder="https://"
      />

      <Button type="submit" fullWidth size="lg" loading={submitting}>
        Create account
      </Button>
    </form>
  );
};

export default RegisterForm;
