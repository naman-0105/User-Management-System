import Skeleton from "../ui/Skeleton";

export default function DataTable({ columns, rows, loading, emptyMessage = "No records found." }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-gray-800/70">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold text-slate-700 dark:text-gray-200">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 transition-colors hover:bg-slate-50/70 dark:border-gray-800 dark:hover:bg-gray-800/40">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-700 dark:text-gray-200">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
