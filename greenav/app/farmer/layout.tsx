"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-zinc-900 border-r border-zinc-800 transition-all duration-300 fixed h-full z-40`}
      >
        <div className="p-6 border-b border-zinc-800">
          <h1
            className={`text-xl font-bold bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent ${
              !sidebarOpen && "text-center"
            }`}
          >
            {sidebarOpen ? "GreenAV Farm" : "GF"}
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { href: "/farmer", label: "Dashboard", icon: "📊" },
            { href: "/farmer/farms", label: "My Farms", icon: "🌾" },
            { href: "/farmer/fields", label: "Fields", icon: "🌱" },
            { href: "/farmer/crops", label: "Crops", icon: "🌽" },
            { href: "/farmer/machines", label: "Machines", icon: "⚙️" },
            { href: "/farmer/alerts", label: "Alerts", icon: "⚠️" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 transition text-zinc-300 hover:text-amber-400 cursor-pointer">
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs transition disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 transition-all duration-300`}>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}