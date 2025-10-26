import React from "react";

export default function ArchivePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Archived Conversations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage resolved conversations
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Archived conversation history will appear here.
        </p>
      </div>
    </div>
  );
}
