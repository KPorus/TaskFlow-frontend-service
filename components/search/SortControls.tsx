import React from "react";

interface Props {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (v: string) => void;
  onSortOrderChange: (v: "asc" | "desc") => void;
}

export const SortControls: React.FC<Props> = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}) => (
  <div className="flex gap-2">
    <select
      value={sortBy}
      onChange={(e) => onSortByChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
    >
      <option value="createdAt">Latest Created</option>
      <option value="dueDate">Nearest Deadline</option>
      <option value="priority">Highest Priority</option>
      <option value="updatedAt">Recently Updated</option>
    </select>
    <select
      value={sortOrder}
      onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
    >
      <option value="desc">Desc</option>
      <option value="asc">Asc</option>
    </select>
  </div>
);
