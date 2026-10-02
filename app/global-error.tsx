"use client";

import "./globals.css";

// Last-resort boundary: replaces the root layout, so it renders its own <html>/<body>.
const GlobalError = ({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) => {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">GearUp hit a problem</h1>
          <p className="mt-2 text-slate-600">
            Something went wrong while loading the app. Please try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-6 cursor-pointer rounded-lg bg-brand-700 px-5 py-2.5 font-semibold text-white hover:bg-brand-800"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
