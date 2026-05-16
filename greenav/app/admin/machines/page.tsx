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
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "idle",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch("/api/machine", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchMachines();
        setShowModal(false);
        setFormData({ name: "", type: "", status: "idle" });
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save machine:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const res = await fetch("/api/machine", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          fetchMachines();
        }
      } catch (err) {
        console.error("Failed to delete machine:", err);
      }
    }
  };

  const getStatusColor = (status: string) => {
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Machines</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", type: "", status: "idle" });
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
        >
          Add Machine
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-600/50 transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{machine.name}</h3>
                <p className="text-emerald-400 text-sm mt-1">{machine.type}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`}></div>
                  <span className="text-zinc-300 text-sm capitalize">{machine.status}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(machine.id);
                    setFormData({
                      name: machine.name,
                      type: machine.type,
                      status: machine.status,
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(machine.id)}
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
              {editingId ? "Edit Machine" : "Add Machine"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Machine Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="text"
                placeholder="Machine Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                required
              >
                <option value="idle">Idle</option>
                <option value="working">Working</option>
                <option value="maintain">Maintenance</option>
              </select>
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