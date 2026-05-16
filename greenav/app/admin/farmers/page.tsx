"use client";

import { useEffect, useState } from "react";

interface Farmer {
  id: number;
  email: string;
  name: string;
  role: string;
  farms: number;
}

interface Farm {
  id: number;
  name: string;
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

  useEffect(() => {
    fetchFarmers();
    fetchFarms();
  }, []);

  const fetchFarmers = async () => {
    try {
      const res = await fetch("/api/farmers");
      const data = await res.json();
      setFarmers(data);
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await fetch("/api/farm");
      const data = await res.json();
      setFarms(data);
    } catch (err) {
      console.error("Failed to fetch farms:", err);
    }
  };

  const openModal = (farmerId: number) => {
    setSelectedFarmerId(farmerId);
    setSelectedFarmId(null);
    setModalOpen(true);
  };

  const assignFarm = async () => {
    if (!selectedFarmerId || !selectedFarmId) return;

    try {
      const res = await fetch("/api/farmers/assign-farm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerId: selectedFarmerId,
          farmId: selectedFarmId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to assign farm");
        return;
      }

      alert("Farm assigned successfully");
      setModalOpen(false);

      // refresh UI
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Manage Farmers</h1>
        <p className="text-zinc-400 mt-2">
          View and manage all farmer accounts
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full" />
        </div>
      ) : farmers.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No farmers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-600/50 transition"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">
                    {farmer.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {farmer.name}
                </h3>

                <p className="text-emerald-400 text-sm mt-1">
                  ID: {farmer.id}
                </p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-white text-xs break-all">
                    {farmer.email}
                  </span>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-emerald-400">
                    {farmer.farms}
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">
                    {farmer.farms === 1 ? "Farm" : "Farms"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(farmer.id)}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                >
                  Assign Farm
                </button>

                <a href={`/admin/farmers/${farmer.id}`} className="flex-1">
                  <button className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition">
                    Details
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-96">
            <h2 className="text-white text-lg font-bold mb-4">
              Assign Farmer to Farm
            </h2>

            <select
              className="w-full p-2 rounded bg-zinc-800 text-white mb-4"
              onChange={(e) => setSelectedFarmId(Number(e.target.value))}
              defaultValue=""
            >
              <option value="">Select farm</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-zinc-700 text-white py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={assignFarm}
                className="flex-1 bg-emerald-600 text-white py-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}