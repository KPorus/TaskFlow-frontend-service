import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchNotifications,
  markNotificationRead,
} from "@/store/slices/notificationSlice";
import { socket, SOCKET_EVENTS } from "@/services/socket";
import { pushSocketNotification } from "@/store/slices/notificationSlice";

export const NotificationBell: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handler = (raw: unknown) => {
      dispatch(pushSocketNotification(raw));
      const msg =
        typeof raw === "object" && raw !== null && "message" in raw
          ? String((raw as { message: string }).message)
          : "New notification";
      setToast(msg);
      setTimeout(() => setToast(null), 4000);
    };
    socket.on(SOCKET_EVENTS.NOTIFICATION, handler);
    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION, handler);
    };
  }, [dispatch]);

  return (
    <div className="relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs">
          {toast}
        </div>
      )}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) dispatch(fetchNotifications());
        }}
        className="relative p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b font-semibold text-gray-800">
              Notifications
            </div>
            {items.length === 0 ? (
              <p className="p-4 text-sm text-gray-400 text-center">
                No notifications
              </p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read) dispatch(markNotificationRead(n.id));
                  }}
                  className={`w-full text-left p-3 border-b hover:bg-gray-50 ${!n.read ? "bg-indigo-50" : ""}`}
                >
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
