import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/app/ui/layout/Navbar";
import Footer from "@/app/ui/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "GearUp — Rent quality gear by the day",
    template: "%s | GearUp",
  },
  description:
    "GearUp connects you with trusted providers so you can rent the gear you need, when you need it — no need to buy.",
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("accessToken") || cookieStore.has("refreshToken");

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers hasSession={hasSession}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
