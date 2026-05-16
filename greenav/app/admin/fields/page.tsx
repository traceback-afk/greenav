"use client";
import { useEffect, useState } from "react";

interface Field {
  id: number;
  farm_id: number;
  name: string;
  area: number;
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    farm_id: "",
    name: "",
    area: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fieldsRes, farmsRes] = await Promise.all([fetch("/api/field"), fetch("/api/farm")]);
      const fieldsData = await fieldsRes.json();
      const farmsData = await farmsRes.json();
      setFields(fieldsData);
      setFarms(farmsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch("/api/field", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchData();
        setShowModal(false);
        setFormData({ farm_id: "", name: "", area: "" });
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save field:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const res = await fetch(`/api/field/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          fetchData();
        }
      } catch (err) {
        console.error("Failed to delete field:", err);
      }
    }
  };

  const getFarmName = (farmId: number) => {
    const farm = farms.find((f) => f.id === farmId);
    return farm ? farm.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Fields</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ farm_id: "", name: "", area: "" });
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
        >
          Add Field
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Field Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Farm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Area (ha)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4 text-white font-medium">{field.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{getFarmName(field.farm_id)}</td>
                    <td className="px-6 py-4 text-zinc-400">{field.area}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(field.id);
                            setFormData({
                              farm_id: field.farm_id.toString(),
                              name: field.name,
                              area: field.area.toString(),
                            });
                            setShowModal(true);
                          }}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(field.id)}
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
              {editingId ? "Edit Field" : "Add Field"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.farm_id}
                onChange={(e) => setFormData({ ...formData, farm_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                required
              >
                <option value="">Select Farm</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Field Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="number"
                placeholder="Area (hectares)"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                step="0.01"
                required
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