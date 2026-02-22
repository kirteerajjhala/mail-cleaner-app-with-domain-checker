import React from 'react';
import { ResponsiveContainer } from 'recharts';

const ChartWrapper = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow h-80">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWrapper;
