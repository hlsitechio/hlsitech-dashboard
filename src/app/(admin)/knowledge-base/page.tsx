import React from "react";

export default function KnowledgeBasePage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Knowledge Base
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage help articles for customers
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg">
          + New Article
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Knowledge base articles will appear here. Customers can search and read articles for self-service support.
        </p>
      </div>
    </div>
  );
}
