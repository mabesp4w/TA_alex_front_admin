/** @format */

import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  containerClassName?: string;
  tableClassName?: string;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
  actions,
  containerClassName = "",
  tableClassName = "",
}: TableProps<T>) => {
  // Render cell content based on accessor
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }

    const value = item[column.accessor as keyof T];

    // Handle different value types
    if (value === null || value === undefined) {
      return <span className="text-base-content/50">-</span>;
    } else if (typeof value === "boolean") {
      return value ? "Yes" : "No";
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } else if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return value;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`overflow-x-auto w-full ${containerClassName}`}>
        <table className={`table w-full ${tableClassName}`}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className}>
                  {column.header}
                </th>
              ))}
              {actions && <th className="w-24">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className}>
                    <div className="h-4 bg-base-300 rounded animate-pulse"></div>
                  </td>
                ))}
                {actions && (
                  <td className="w-24">
                    <div className="h-8 bg-base-300 rounded animate-pulse"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`overflow-x-auto w-full ${containerClassName}`}>
        <table className={`table w-full ${tableClassName}`}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className}>
                  {column.header}
                </th>
              ))}
              {actions && <th className="w-24">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-8"
              >
                <div className="flex flex-col items-center justify-center text-base-content/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Data state
  return (
    <div className={`overflow-x-auto w-full ${containerClassName}`}>
      <table className={`table w-full ${tableClassName}`}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.header}
              </th>
            ))}
            {actions && <th className="w-24">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={onRowClick ? "cursor-pointer hover:bg-base-200" : ""}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.className}>
                  {renderCell(item, column)}
                </td>
              ))}
              {actions && <td className="w-24">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
