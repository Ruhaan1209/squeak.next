"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type NotificationType = 'error' | 'success';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  isLeaving?: boolean;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleDismiss = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isLeaving: true } : n))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  }, []);

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'error') => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);
      const timeout = type === 'error' ? 10000 : 3000;
      setTimeout(() => handleDismiss(id), timeout);
    },
    [handleDismiss]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[1000] flex flex-col-reverse gap-2.5 pointer-events-none items-end">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleDismiss(notification.id)}
            className={`pointer-events-auto cursor-pointer rounded px-6 py-3 shadow-md max-w-[300px] font-medium min-h-[20px] flex items-center justify-center transition-all duration-300 ${
              notification.isLeaving ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0 animate-slide-in'
            } ${
              notification.type === 'error'
                ? 'bg-red-200 text-red-900'
                : 'bg-green-200 text-green-900'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
