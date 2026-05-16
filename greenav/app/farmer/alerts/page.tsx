"use client";
import { useEffect, useState } from "react";

interface Alert {
  id: number;
  message: string;
  timestamp: string;
  severity: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alert");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts =
    filterSeverity === "all" ? alerts : alerts.filter((a) => a.severity === filterSeverity);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-blue-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-blue-500/10 border-blue-500/30";
      case "Medium":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "High":
        return "bg-red-500/10 border-red-500/30";
      default:
        return "bg-gray-500/10 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">System Alerts</h1>
        <p className="text-zinc-400 mt-2">Important alerts and notifications</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "Low", "Medium", "High"].map((severity) => (
          <button
            key={severity}
            onClick={() => setFilterSeverity(severity)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterSeverity === severity
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {severity}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No alerts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-xl p-6 ${getSeverityBgColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`}></div>
                  <div>
                    <p className="text-white font-medium leading-relaxed">{alert.message}</p>
                    <p className="text-zinc-400 text-sm mt-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}