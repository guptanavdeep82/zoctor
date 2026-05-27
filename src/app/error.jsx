"use client";

export default function Error({ reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-care-bg px-6 text-center">
      <section className="max-w-sm rounded-[28px] bg-white p-7 shadow-xl shadow-sky-200/60">
        <h1 className="text-2xl font-bold text-sky-950">Something needs a quick check</h1>
        <p className="mt-3 text-sm text-sky-700">
          The page could not load. Please try again in a moment.
        </p>
        <button
          className="mt-6 rounded-2xl bg-care-blue px-6 py-3 font-semibold text-white shadow-lg shadow-sky-300"
          onClick={reset}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
