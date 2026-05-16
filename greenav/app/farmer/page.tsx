"use client";

import { useEffect, useState } from "react";
import {
  Tractor,
  Sprout,
  Wheat,
  Cog,
  Bell,
  LayoutDashboard,
  Lightbulb,
} from "lucide-react";

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
        const userId = 2; // ⚠️ replace with real auth/session later

        // 1. GET ONLY FARMER'S FARMS
        const farmsRes = await fetch("/api/farm/my", {
          headers: {
            "x-user-id": String(userId),
          },
        });

        const farms = await farmsRes.json();

        let fields: any[] = [];

        // 2. ONLY FETCH FIELDS IF FARM EXISTS
        if (farms.length > 0) {
          const farmIds = farms.map((f: any) => f.id);

          const fieldsRes = await fetch("/api/field/by-farms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ farmIds }),
          });

          fields = await fieldsRes.json();
        }

        // 3. GLOBAL DATA (unchanged)
        const [cropsRes, machinesRes, alertsRes] = await Promise.all([
          fetch("/api/crop"),
          fetch("/api/machine"),
          fetch("/api/alert"),
        ]);

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
    {
      label: "My Farms",
      value: stats.farms,
      icon: Tractor,
      color: "text-amber-400",
    },
    {
      label: "Fields",
      value: stats.fields,
      icon: Sprout,
      color: "text-green-400",
    },
    {
      label: "Crops Available",
      value: stats.crops,
      icon: Wheat,
      color: "text-yellow-400",
    },
    {
      label: "Machines",
      value: stats.machines,
      icon: Cog,
      color: "text-orange-400",
    },
    {
      label: "Alerts",
      value: stats.alerts,
      icon: Bell,
      color: "text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-amber-400" />
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome to Your Farm Dashboard
          </h1>
          <p className="text-zinc-400">
            Manage your farms, fields, and resources
          </p>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-600/50 transition hover:shadow-lg hover:shadow-amber-500/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {card.value}
                    </p>
                  </div>

                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Pro Tips</h3>
        </div>

        <ul className="space-y-2 text-amber-100">
          <li>• Keep your farm information updated for better planning</li>
          <li>• Monitor crop growth stages regularly</li>
          <li>• Check machine availability before scheduling work</li>
          <li>• Review alerts early to prevent losses</li>
        </ul>
      </div>
    </div>
  );
}