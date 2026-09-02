import React from 'react';

const DashboardPlaceholder = ({ title }) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">This section is currently under construction.</p>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;
