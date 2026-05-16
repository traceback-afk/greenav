// app/admin/farmers/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Farmer {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      // Since we don't have a users endpoint, we'll fetch all farms and extract unique farmers
      const res = await fetch("/api/farm");
      const farms = await res.json();

      // Extract unique farmers from farms
      const uniqueFarmers: { [key: number]: any } = {};
      farms.forEach((farm: any) => {
        if (farm.farmer_id && !uniqueFarmers[farm.farmer_id]) {
          uniqueFarmers[farm.farmer_id] = {
            id: farm.farmer_id,
            name: farm.farmer_name,
            farms: 1,
          };
        } else if (farm.farmer_id) {
          uniqueFarmers[farm.farmer_id].farms += 1;
        }
      });

      setFarmers(Object.values(uniqueFarmers));
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Manage Farmers</h1>
        <p className="text-zinc-400 mt-2">View and manage all farmer accounts</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
        </div>
      ) : farmers.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No farmers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer: any) => (
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
                <h3 className="text-lg font-bold text-white">{farmer.name}</h3>
                <p className="text-emerald-400 text-sm mt-1">Farmer #{farmer.id}</p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{farmer.farms}</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    {farmer.farms === 1 ? "Farm" : "Farms"}
                  </p>
                </div>
              </div>

              <a href={`/admin/farms?farmer=${farmer.id}`} className="block">
                <button className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition">
                  View Farms
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}