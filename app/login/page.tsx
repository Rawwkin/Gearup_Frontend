import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/app/ui/auth/AuthShell";
import LoginForm from "@/app/ui/auth/LoginForm";
import { safeNextPath } from "@/lib/navigation";

export const metadata: Metadata = { title: "Sign in" };

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  const registerHref = nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your rentals and listings."
      footer={
        <>
          New to GearUp?{" "}
          <Link href={registerHref} className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={nextPath} />
    </AuthShell>
  );
};

export default LoginPage;
