"use client";
import { useEffect, useState } from "react";

interface Field {
  id: number;
  farm_id: number;
  name: string;
  area: number;
}

interface Farm {
  id: number;
  name: string;
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
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
      const res = await fetch(editingId ? `/api/field/${editingId}` : "/api/field", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        const res = await fetch(`/api/field/${id}`, { method: "DELETE" });
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
        <h1 className="text-3xl font-bold text-white">My Fields</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ farm_id: "", name: "", area: "" });
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition"
        >
          Add Field
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400 mb-4">You don't have any fields yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition"
          >
            Create Your First Field
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-600/50 transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{field.name}</h3>
                <p className="text-amber-400 text-sm mt-1">{getFarmName(field.farm_id)}</p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Area:</span>
                  <span className="text-white font-bold">{field.area} ha</span>
                </div>
              </div>

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
                  className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(field.id)}
                  className="flex-1 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
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
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                required
              />
              <input
                type="number"
                placeholder="Area (hectares)"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
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
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition"
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