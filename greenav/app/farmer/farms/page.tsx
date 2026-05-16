// app/farmer/farms/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Farm {
  id: number;
  name: string;
  size: number;
  location: string;
  soil_type: string;
  planting_date: string;
  harvest_date: string;
}

export default function FarmerFarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const res = await fetch("/api/farm");
      const data = await res.json();
      setFarms(data);
    } catch (err) {
      console.error("Failed to fetch farms:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Farms I Work On</h1>
        <p className="text-zinc-400 mt-2">View all farms assigned to you</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400 mb-4">You haven't been assigned to any farms yet</p>
          <p className="text-zinc-500 text-sm">Contact your administrator to be added to a farm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-600/50 transition"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">{farm.name}</h3>
                <p className="text-amber-400 text-sm mt-1">{farm.location}</p>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Size:</span>
                  <span className="text-white font-medium">{farm.size} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Soil Type:</span>
                  <span className="text-white font-medium">
                    {farm.soil_type || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Planting Date:</span>
                  <span className="text-white font-medium">
                    {farm.planting_date
                      ? new Date(farm.planting_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Harvest Date:</span>
                  <span className="text-white font-medium">
                    {farm.harvest_date
                      ? new Date(farm.harvest_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <a href={`/farmer/farms/${farm.id}`}>
                <button className="w-full px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition">
                  View Details
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}