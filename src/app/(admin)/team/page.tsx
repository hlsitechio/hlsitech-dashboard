import React from "react";

export default function TeamPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage support agents and team performance
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg">
          + Add Team Member
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Team member list with roles, availability, and performance metrics will appear here.
        </p>
      </div>
    </div>
  );
}
