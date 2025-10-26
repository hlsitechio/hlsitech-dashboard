import React from "react";

export default function WebsiteAnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Website Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Google Analytics data for hlsitech.com
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Visitors</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect GA4</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Page Views (Today)</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect GA4</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session Duration</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect GA4</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect GA4</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Traffic Overview
          </h3>
          <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm">
            Connect Google Analytics
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Website traffic charts and metrics will appear here after connecting Google Analytics 4
        </p>
      </div>
    </div>
  );
}
