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
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    growth_duration: "",
    local_temp: "",
    ideal_moisture: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch("/api/crop", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchCrops();
        setShowModal(false);
        setFormData({
          name: "",
          growth_duration: "",
          local_temp: "",
          ideal_moisture: "",
        });
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save crop:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const res = await fetch("/api/crop", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          fetchCrops();
        }
      } catch (err) {
        console.error("Failed to delete crop:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Crops</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              growth_duration: "",
              local_temp: "",
              ideal_moisture: "",
            });
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
        >
          Add Crop
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Crop Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Growth Duration (days)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Temp (°C)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Moisture (%)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4 text-white font-medium">{crop.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{crop.growth_duration}</td>
                    <td className="px-6 py-4 text-zinc-400">{crop.local_temp || "N/A"}</td>
                    <td className="px-6 py-4 text-zinc-400">{crop.ideal_moisture || "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(crop.id);
                            setFormData({
                              name: crop.name,
                              growth_duration: crop.growth_duration.toString(),
                              local_temp: crop.local_temp?.toString() || "",
                              ideal_moisture: crop.ideal_moisture?.toString() || "",
                            });
                            setShowModal(true);
                          }}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(crop.id)}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? "Edit Crop" : "Add Crop"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Crop Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="number"
                placeholder="Growth Duration (days)"
                value={formData.growth_duration}
                onChange={(e) => setFormData({ ...formData, growth_duration: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="number"
                placeholder="Local Temperature (°C)"
                value={formData.local_temp}
                onChange={(e) => setFormData({ ...formData, local_temp: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Ideal Moisture (%)"
                value={formData.ideal_moisture}
                onChange={(e) => setFormData({ ...formData, ideal_moisture: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                step="0.1"
              />
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}