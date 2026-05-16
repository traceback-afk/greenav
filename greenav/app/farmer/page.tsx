"use client";
import { useEffect, useState } from "react";

interface FarmerStats {
  farms: number;
  fields: number;
  crops: number;
  machines: number;
  alerts: number;
}

export default function FarmerDashboard() {
  const [stats, setStats] = useState<FarmerStats>({
    farms: 0,
    fields: 0,
    crops: 0,
    machines: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [farmsRes, fieldsRes, cropsRes, machinesRes, alertsRes] = await Promise.all([
          fetch("/api/farm"),
          fetch("/api/field"),
          fetch("/api/crop"),
          fetch("/api/machine"),
          fetch("/api/alert"),
        ]);

        const farms = await farmsRes.json();
        const fields = await fieldsRes.json();
        const crops = await cropsRes.json();
        const machines = await machinesRes.json();
        const alerts = await alertsRes.json();

        setStats({
          farms: farms.length,
          fields: fields.length,
          crops: crops.length,
          machines: machines.length,
          alerts: alerts.length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "My Farms", value: stats.farms, icon: "🌾", color: "amber" },
    { label: "Fields", value: stats.fields, icon: "🌱", color: "green" },
    { label: "Crops Available", value: stats.crops, icon: "🌽", color: "yellow" },
    { label: "Machines", value: stats.machines, icon: "⚙️", color: "orange" },
    { label: "Alerts", value: stats.alerts, icon: "⚠️", color: "red" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Your Farm Dashboard</h1>
        <p className="text-zinc-400">Manage your farms, fields, and resources</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-600/50 transition hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Add Farm", href: "/farmer/farms" },
            { label: "Add Field", href: "/farmer/fields" },
            { label: "View Alerts", href: "/farmer/alerts" },
          ].map((action) => (
            <a key={action.label} href={action.href}>
              <button className="w-full px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition">
                {action.label}
              </button>
            </a>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-3">Pro Tips</h3>
        <ul className="space-y-2 text-amber-100">
          <li>• Keep your farm information updated for better resource planning</li>
          <li>• Monitor crop growth stages and plan harvesting accordingly</li>
          <li>• Check machine availability before scheduling field operations</li>
          <li>• Review alerts regularly to catch issues early</li>
        </ul>
      </div>
    </div>
  );
}