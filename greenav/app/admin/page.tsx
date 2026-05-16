"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Tractor,
  Map,
  Sprout,
  Cog,
  Radar,
  Bell,
  LayoutDashboard,
} from "lucide-react";

interface Stats {
  farmers: number;
  farms: number;
  fields: number;
  crops: number;
  machines: number;
  sensors: number;
  alerts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    farmers: 0,
    farms: 0,
    fields: 0,
    crops: 0,
    machines: 0,
    sensors: 0,
    alerts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          farmsRes,
          fieldsRes,
          cropsRes,
          machinesRes,
          sensorsRes,
          alertsRes,
        ] = await Promise.all([
          fetch("/api/farm"),
          fetch("/api/field"),
          fetch("/api/crop"),
          fetch("/api/machine"),
          fetch("/api/iot-sensor"),
          fetch("/api/alert"),
        ]);

        const farms = await farmsRes.json();
        const fields = await fieldsRes.json();
        const crops = await cropsRes.json();
        const machines = await machinesRes.json();
        const sensors = await sensorsRes.json();
        const alerts = await alertsRes.json();

        setStats({
          farmers: farms.length,
          farms: farms.length,
          fields: fields.length,
          crops: crops.length,
          machines: machines.length,
          sensors: sensors.length,
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
      label: "Farmers",
      value: stats.farmers,
      icon: Users,
      color: "text-emerald-400",
    },
    {
      label: "Farms",
      value: stats.farms,
      icon: Tractor,
      color: "text-blue-400",
    },
    {
      label: "Fields",
      value: stats.fields,
      icon: Map,
      color: "text-green-400",
    },
    {
      label: "Crops",
      value: stats.crops,
      icon: Sprout,
      color: "text-yellow-400",
    },
    {
      label: "Machines",
      value: stats.machines,
      icon: Cog,
      color: "text-orange-400",
    },
    {
      label: "Sensors",
      value: stats.sensors,
      icon: Radar,
      color: "text-purple-400",
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
        <LayoutDashboard className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome to GreenAV Admin
          </h1>
          <p className="text-zinc-400">
            Manage all agricultural resources and operations
          </p>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition hover:shadow-lg hover:shadow-emerald-500/10"
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

      {/* Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Add Crop", href: "/admin/crops" },
            { label: "Add Machine", href: "/admin/machines" },
            { label: "Add Sensor", href: "/admin/sensors" },
            { label: "View Alerts", href: "/admin/alerts" },
          ].map((action) => (
            <a key={action.label} href={action.href}>
              <button className="w-full px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition">
                {action.label}
              </button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}