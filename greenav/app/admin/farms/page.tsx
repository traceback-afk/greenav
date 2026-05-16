// app/admin/farms/page.tsx
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

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
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
      let res;

      if (editingId) {
        // PUT request to dynamic route
        res = await fetch(`/api/farm/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // POST request to base route
        res = await fetch("/api/farm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchFarms();
        setShowModal(false);
        setFormData({
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
        const res = await fetch(`/api/farm/${id}`, {
          method: "DELETE",
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
      ) : farms.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No farms created yet</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Farm Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Size (ha)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Soil Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Plantation Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Harvest Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farms.map((farm) => (
                  <tr key={farm.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4 text-white">{farm.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{farm.location}</td>
                    <td className="px-6 py-4 text-zinc-400">{farm.size}</td>
                    <td className="px-6 py-4 text-zinc-400">{farm.soil_type || "N/A"}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {farm.planting_date ? farm.planting_date.split("T")[0] : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {farm.harvest_date ? farm.harvest_date.split("T")[0] : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(farm.id);
                            setFormData({
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
                        <a href={`/admin/farms/${farm.id}/workers`}>
                          <button
                            type="button"
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition"
                          >
                            Workers
                          </button>
                        </a>
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