"use client";

import { useEffect, useState } from "react";

interface Field {
  id: number;
  farm_id: number;
  name: string;
  area: number;
  status?: string;
}

interface Farm {
  id: number;
  name: string;
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. get farms assigned to THIS farmer
      const farmsRes = await fetch("/api/farm/my");
      const farmsData: Farm[] = await farmsRes.json();

      setFarms(farmsData);

      // 2. if no farms → stop here
      if (!farmsData.length) {
        setFields([]);
        return;
      }

      // 3. fetch only fields for assigned farms
      const farmIds = farmsData.map((f) => f.id);

      const fieldsRes = await fetch("/api/field/by-farms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ farmIds }),
      });

      const fieldsData = await fieldsRes.json();
      setFields(fieldsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFarmName = (farmId: number) => {
    const farm = farms.find((f) => f.id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Plant":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "Growth":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "Harvest":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-zinc-800/50 border-zinc-700 text-zinc-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Fields</h1>
        <p className="text-zinc-400 mt-2">
          View all fields in your assigned farms
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full" />
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No fields available yet</p>
          <p className="text-zinc-500 text-sm mt-2">
            Fields will appear once they are created for your farms
          </p>
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
                <p className="text-amber-400 text-sm mt-1">
                  {getFarmName(field.farm_id)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Area:</span>
                    <span className="text-white font-bold">
                      {field.area} ha
                    </span>
                  </div>
                </div>

                {field.status && (
                  <div
                    className={`border rounded-lg p-3 ${getStatusColor(
                      field.status
                    )}`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider">
                      Status: {field.status}
                    </p>
                  </div>
                )}
              </div>

              <a href={`/farmer/fields/${field.id}`}>
                <button className="w-full mt-4 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition text-sm">
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