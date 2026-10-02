import Link from "next/link";
import { ArrowRight, CalendarCheck, CreditCard, PackageCheck, Search, Store } from "lucide-react";
import Container from "@/app/ui/Container";
import GearGrid from "@/app/ui/gear/GearGrid";
import ErrorState from "@/app/ui/ErrorState";
import { buttonStyles } from "@/lib/button-styles";
import { categoriesApi, gearApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/http";
import type { Category, GearItem } from "@/types";

const steps = [
  {
    icon: Search,
    title: "Find your gear",
    text: "Search by category, brand, price or location and compare ratings from real renters.",
  },
  {
    icon: CalendarCheck,
    title: "Request your dates",
    text: "Pick the days you need it. The provider confirms your request.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Once confirmed, pay by card through Stripe to lock in your rental.",
  },
  {
    icon: PackageCheck,
    title: "Pick up & return",
    text: "Collect your gear, enjoy it, return it — then leave a review.",
  },
];

const Home = async () => {
  let categories: Category[] = [];
  let latest: GearItem[] = [];
  let loadError: string | null = null;

  const [categoriesResult, gearResult] = await Promise.allSettled([
    categoriesApi.list(),
    gearApi.list(),
  ]);

  if (categoriesResult.status === "fulfilled") categories = categoriesResult.value;
  if (gearResult.status === "fulfilled") latest = gearResult.value.slice(0, 8);
  else loadError = getErrorMessage(gearResult.reason, "Unable to load gear right now.");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(249,115,22,0.35),transparent),radial-gradient(40%_60%_at_0%_100%,rgba(234,88,12,0.2),transparent)]"
        />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
              Gear rental marketplace
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Rent the gear.
              <br />
              <span className="text-brand-400">Skip the price tag.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Book quality gear from trusted providers by the day. Transparent pricing, secure
              payments and honest reviews.
            </p>
            <form action="/gear" method="get" className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">
                Search gear
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="What do you need to rent?"
                className="h-12 flex-1 rounded-lg border-0 bg-white px-4 text-base text-slate-900 placeholder:text-slate-500"
              />
              <button type="submit" className={buttonStyles({ size: "lg" })}>
                <Search className="size-4" aria-hidden="true" />
                Search
              </button>
            </form>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <Container className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Browse by category
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/gear?category=${encodeURIComponent(category.name)}`}
                    className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand-600 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Latest gear */}
      <section>
        <Container className="py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Fresh on GearUp
              </h2>
              <p className="mt-1 text-slate-600">The latest gear listed by our providers.</p>
            </div>
            <Link
              href="/gear"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {loadError ? (
            <ErrorState message={loadError} />
          ) : latest.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-600">
              No gear has been listed yet. Check back soon!
            </div>
          ) : (
            <GearGrid items={latest} />
          )}

          <div className="mt-6 sm:hidden">
            <Link href="/gear" className={buttonStyles({ variant: "outline", fullWidth: true })}>
              View all gear
            </Link>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white">
        <Container className="py-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            How GearUp works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="relative rounded-xl border border-slate-200 bg-slate-50 p-5">
                <span className="absolute right-4 top-4 text-3xl font-extrabold text-slate-200">
                  {index + 1}
                </span>
                <div className="flex size-11 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Provider CTA */}
      <section>
        <Container className="py-14">
          <div className="flex flex-col items-start gap-6 rounded-2xl bg-slate-900 p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="flex size-11 items-center justify-center rounded-lg bg-brand-700">
                <Store className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Got gear sitting idle?</h2>
              <p className="mt-2 text-slate-300">
                List it on GearUp, manage bookings from your dashboard and turn unused equipment
                into income.
              </p>
            </div>
            <Link
              href="/register?role=PROVIDER"
              className={buttonStyles({ size: "lg", className: "shrink-0" })}
            >
              Become a provider
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;
