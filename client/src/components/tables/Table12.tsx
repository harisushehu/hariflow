import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface TableiProps {
  data: any[];
  columns: TableColumn[];
  onRowClick?: (row: any) => void;
  loading?: boolean;
}

export function Tablei({ data, columns, onRowClick, loading }: TableiProps) {
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 text-gray-700">
                  {col.render ? col.render(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tablei;
