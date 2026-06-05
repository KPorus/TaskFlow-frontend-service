import React from "react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-center py-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};
