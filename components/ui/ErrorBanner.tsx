import React from "react";
import { X } from "lucide-react";

interface Props {
  message: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<Props> = ({ message, onDismiss }) => (
  <div
    role="alert"
    className="mx-4 mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm"
  >
    <p className="flex-1">{message}</p>
    <button
      type="button"
      onClick={onDismiss}
      className="shrink-0 rounded p-0.5 hover:bg-red-100"
      aria-label="Dismiss error"
    >
      <X size={16} />
    </button>
  </div>
);
