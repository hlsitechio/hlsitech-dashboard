import React from "react";

export default function AIControlPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Control Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage AI chatbot settings and behavior
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Status
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            AI control toggles and settings will appear here.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Agent Takeover
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Agent takeover controls will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
