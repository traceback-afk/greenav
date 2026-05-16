"use client";
import { useEffect, useState } from "react";

interface Farm {
  id: number;
  farmer_id: number;
  farmer_name: string;
  name: string;
  size: number;
  location: string;
  soil_type: string;
  planting_date: string;
  harvest_date: string;
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    farmer_id: "",
    name: "",
    size: "",
    location: "",
    soil_type: "",
    planting_date: "",
    harvest_date: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch("/api/farm", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchFarms();
        setShowModal(false);
        setFormData({
          farmer_id: "",
          name: "",
          size: "",
          location: "",
          soil_type: "",
          planting_date: "",
          harvest_date: "",
        });
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save farm:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const res = await fetch("/api/farm", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          fetchFarms();
        }
      } catch (err) {
        console.error("Failed to delete farm:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Farms</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              farmer_id: "",
              name: "",
              size: "",
              location: "",
              soil_type: "",
              planting_date: "",
              harvest_date: "",
            });
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
        >
          Add Farm
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Farm Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Farmer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Size (ha)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farms.map((farm) => (
                  <tr key={farm.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4 text-white">{farm.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{farm.farmer_name}</td>
                    <td className="px-6 py-4 text-zinc-400">{farm.location}</td>
                    <td className="px-6 py-4 text-zinc-400">{farm.size}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(farm.id);
                            setFormData({
                              farmer_id: farm.farmer_id.toString(),
                              name: farm.name,
                              size: farm.size.toString(),
                              location: farm.location,
                              soil_type: farm.soil_type || "",
                              planting_date: farm.planting_date || "",
                              harvest_date: farm.harvest_date || "",
                            });
                            setShowModal(true);
                          }}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(farm.id)}
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? "Edit Farm" : "Add Farm"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Farmer ID"
                  value={formData.farmer_id}
                  onChange={(e) => setFormData({ ...formData, farmer_id: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Farm Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Size (hectares)"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  step="0.01"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Soil Type"
                  value={formData.soil_type}
                  onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="date"
                  value={formData.planting_date}
                  onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="date"
                  value={formData.harvest_date}
                  onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
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