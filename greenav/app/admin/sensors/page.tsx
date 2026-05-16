// app/admin/sensors/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Sensor {
  id: number;
  type: string;
  status: string;
  install_date: string;
  sensor_id?: string;
  field_id?: number;
  field_name?: string;
  farm_id?: number;
}

interface Field {
  id: number;
  name: string;
  farm_id: number;
}

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: "Temp",
    status: "active",
    install_date: "",
    field_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sensorsRes, fieldsRes] = await Promise.all([
        fetch("/api/iot-sensor"),
        fetch("/api/field"),
      ]);
      const sensorsData = await sensorsRes.json();
      const fieldsData = await fieldsRes.json();
      setSensors(sensorsData);
      setFields(fieldsData);
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
      const body = editingId
        ? { id: editingId, ...formData }
        : {
            type: formData.type,
            status: formData.status,
            install_date: formData.install_date,
            field_id: formData.field_id ? parseInt(formData.field_id) : null,
          };

      const res = await fetch("/api/iot-sensor", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchData();
        setShowModal(false);
        setFormData({
          type: "Temp",
          status: "active",
          install_date: "",
          field_id: "",
        });
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save sensor:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const res = await fetch("/api/iot-sensor", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          fetchData();
        }
      } catch (err) {
        console.error("Failed to delete sensor:", err);
      }
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "Temp":
        return "🌡️";
      case "Humidity":
        return "💧";
      case "Moist":
        return "🌍";
      default:
        return "📡";
    }
  };

  const getFieldName = (fieldId?: number) => {
    if (!fieldId) return "Not Installed";
    const field = fields.find((f) => f.id === fieldId);
    return field ? field.name : "Unknown Field";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Sensors</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              type: "Temp",
              status: "active",
              install_date: "",
              field_id: "",
            });
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
        >
          Add Sensor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
        </div>
      ) : sensors.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No sensors created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-600/50 transition"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">
                      Sensor #{sensor.id}
                    </p>
                    <p className="text-xl font-bold text-white mt-1">
                      {getSensorIcon(sensor.type)} {sensor.type}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="text-white font-medium capitalize">
                    {sensor.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Installed:</span>
                  <span className="text-white font-medium">
                    {new Date(sensor.install_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 mt-3">
                  <p className="text-zinc-400 text-xs">Field Location</p>
                  <p className="text-white font-semibold mt-1">
                    {getFieldName(sensor.field_id)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(sensor.id);
                    setFormData({
                      type: sensor.type,
                      status: sensor.status,
                      install_date: sensor.install_date,
                      field_id: sensor.field_id?.toString() || "",
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sensor.id)}
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
              {editingId ? "Edit Sensor" : "Add Sensor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                required
              >
                <option value="Temp">Temperature</option>
                <option value="Humidity">Humidity</option>
                <option value="Moist">Soil Moisture</option>
              </select>

              <input
                type="text"
                placeholder="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />

              <input
                type="date"
                value={formData.install_date}
                onChange={(e) =>
                  setFormData({ ...formData, install_date: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />

              <select
                value={formData.field_id}
                onChange={(e) =>
                  setFormData({ ...formData, field_id: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Not Installed (Select Field)</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
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