import React from "react";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<Props> = ({ value, onChange }) => (
  <div className="relative flex-1 min-w-[200px]">
    <Search
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search tasks..."
      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);
