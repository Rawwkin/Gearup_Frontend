import Link from "next/link";
import Container from "@/app/ui/Container";
import { buttonStyles } from "@/lib/button-styles";

const NotFound = () => {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">404</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className={buttonStyles({ size: "lg" })}>
          Go home
        </Link>
        <Link href="/gear" className={buttonStyles({ variant: "outline", size: "lg" })}>
          Browse gear
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
