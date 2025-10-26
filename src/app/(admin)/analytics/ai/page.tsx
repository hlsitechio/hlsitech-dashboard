import React from "react";

export default function AIPerformancePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Performance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor AI chatbot accuracy and effectiveness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">AI Responses</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total AI messages</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No data yet</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Escalation Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI → Human handoff</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI response confidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Common AI Responses
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Most frequent AI-generated responses
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Questions AI Couldn't Answer
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Questions that required human escalation
          </p>
        </div>
      </div>
    </div>
  );
}
