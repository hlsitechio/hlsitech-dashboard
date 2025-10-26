import React from "react";

export default function TicketsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage customer support tickets
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ticket Overview
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Ticket list with status, priority, and assignment will appear here.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
