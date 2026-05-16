"use client";
import { useEffect, useState } from "react";

interface Crop {
  id: number;
  name: string;
  growth_duration: number;
  local_temp: number;
  ideal_moisture: number;
}

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await fetch("/api/crop");
      const data = await res.json();
      setCrops(data);
    } catch (err) {
      console.error("Failed to fetch crops:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter((crop) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Available Crops</h1>
        <p className="text-zinc-400 mt-2">Browse and learn about available crops for planting</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search crops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No crops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-600/50 transition"
            >
              <h3 className="text-lg font-bold text-white mb-4">{crop.name}</h3>

              <div className="space-y-3 text-sm">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-zinc-400">Growth Duration</p>
                  <p className="text-xl font-bold text-amber-400 mt-1">{crop.growth_duration} days</p>
                </div>

                {crop.local_temp && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <p className="text-zinc-400">Optimal Temperature</p>
                    <p className="text-lg font-bold text-white mt-1">{crop.local_temp}°C</p>
                  </div>
                )}

                {crop.ideal_moisture && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <p className="text-zinc-400">Ideal Moisture</p>
                    <p className="text-lg font-bold text-white mt-1">{crop.ideal_moisture}%</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition">
                Learn More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}