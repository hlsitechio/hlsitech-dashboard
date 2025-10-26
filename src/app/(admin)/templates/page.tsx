import React from "react";

export default function TemplatesPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Canned Responses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Pre-written templates for common customer questions
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg">
          + New Template
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Canned response templates will appear here. Use shortcodes to quickly insert responses during live chat.
        </p>
      </div>
    </div>
  );
}
