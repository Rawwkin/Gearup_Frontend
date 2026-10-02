import Link from "next/link";
import Logo from "@/app/ui/layout/Logo";
import Container from "@/app/ui/Container";
import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-slate-600">
            Rent the gear you need, by the day, from providers you can trust — no need to buy.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <Link href="/gear" className="text-slate-600 hover:text-brand-700">
            Browse gear
          </Link>
          <Link href="/register?role=PROVIDER" className="text-slate-600 hover:text-brand-700">
            Become a provider
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-brand-700">
            Sign in
          </Link>
          <Link href="/register" className="text-slate-600 hover:text-brand-700">
            Create account
          </Link>
        </nav>
      </Container>
      <div className="border-t border-slate-100 py-4">
        <Container>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
