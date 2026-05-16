// app/components/DataTable.tsx
"use client";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  showActions?: boolean;
}

export default function DataTable({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  showActions = true,
}: DataTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-white">
                  {col.label}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-zinc-300">
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs transition"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}