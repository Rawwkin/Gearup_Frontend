import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/app/ui/auth/AuthShell";
import RegisterForm from "@/app/ui/auth/RegisterForm";
import { safeNextPath } from "@/lib/navigation";

export const metadata: Metadata = { title: "Create your account" };

const RegisterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { role, next } = await searchParams;
  const initialRole = role === "PROVIDER" ? "PROVIDER" : "CUSTOMER";
  const nextPath = safeNextPath(next);
  const loginHref = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join GearUp to rent gear or start earning from yours."
      footer={
        <>
          Already have an account?{" "}
          <Link href={loginHref} className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm initialRole={initialRole} next={nextPath} />
    </AuthShell>
  );
};

export default RegisterPage;
