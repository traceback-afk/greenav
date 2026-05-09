import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl border border-gray-200 p-10 text-center">
        <div className="text-6xl font-bold text-gray-900">403</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Access denied
        </h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to access this page.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-gray-900 px-6 py-3 font-medium text-white hover:bg-black"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}