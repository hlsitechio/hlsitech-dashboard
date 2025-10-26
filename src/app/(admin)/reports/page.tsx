import React from "react";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Exports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate custom reports and export data
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Reports
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Pre-built report templates
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Export Data
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Export conversations, customers, and analytics
          </p>
        </div>
      </div>
    </div>
  );
}
