"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-zinc-900 shadow-2xl border border-zinc-800 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Protected Dashboard
              </h1>
              <p className="mt-4 text-lg text-zinc-400">
                You are successfully authenticated.
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}