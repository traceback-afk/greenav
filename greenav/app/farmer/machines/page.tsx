"use client";
import { useEffect, useState } from "react";

interface Machine {
  id: number;
  name: string;
  type: string;
  status: string;
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await fetch("/api/machine");
      const data = await res.json();
      setMachines(data);
    } catch (err) {
      console.error("Failed to fetch machines:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMachines =
    filterStatus === "all" ? machines : machines.filter((m) => m.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle":
        return "bg-blue-500 text-blue-100";
      case "working":
        return "bg-green-500 text-green-100";
      case "maintain":
        return "bg-yellow-500 text-yellow-100";
      default:
        return "bg-gray-500 text-gray-100";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "idle":
        return "bg-blue-500";
      case "working":
        return "bg-green-500";
      case "maintain":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Available Machines</h1>
        <p className="text-zinc-400 mt-2">View available agricultural machinery and equipment</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "idle", "working", "maintain"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredMachines.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No machines available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-600/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{machine.name}</h3>
                  <p className="text-amber-400 text-sm mt-1">{machine.type}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusDot(machine.status)} mt-1`}></div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3 mb-4">
                <p className="text-zinc-400 text-xs">Status</p>
                <p className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(machine.status)} capitalize`}>
                  {machine.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}