import React from "react";

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all notifications and configure preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Notifications
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Notification feed will appear here (new chats, escalations, tickets, etc.)
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Settings
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Email, push, and in-app notification preferences
          </p>
        </div>
      </div>
    </div>
  );
}
