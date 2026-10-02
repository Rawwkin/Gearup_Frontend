import type { ReactNode } from "react";
import { BadgeCheck, CalendarCheck, ShieldCheck } from "lucide-react";
import Card from "@/app/ui/Card";

const perks = [
  { icon: BadgeCheck, text: "Trusted providers with real customer reviews" },
  { icon: CalendarCheck, text: "Flexible day-based rentals, priced up front" },
  { icon: ShieldCheck, text: "Secure card payments through Stripe" },
];

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) => {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <div className="hidden lg:block">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Get the gear.
          <br />
          <span className="text-brand-700">Skip the ownership.</span>
        </h2>
        <ul className="mt-8 space-y-4">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-slate-700">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
          {footer}
        </div>
      </Card>
    </div>
  );
};

export default AuthShell;
