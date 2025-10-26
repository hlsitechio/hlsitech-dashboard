import React from "react";

export default function SupportMetricsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Metrics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track customer support performance and KPIs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 0% from last week</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No data yet</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No data yet</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No ratings yet</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conversation Volume
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Chart showing conversation trends over time will appear here
        </p>
      </div>
    </div>
  );
}
