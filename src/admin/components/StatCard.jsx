import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue', loading }) => {
  const colors = {
    blue: 'border-blue-500 bg-blue-100 text-blue-500',
    green: 'border-green-500 bg-green-100 text-green-500',
    red: 'border-red-500 bg-red-100 text-red-800',
    yellow: 'border-yellow-500 bg-yellow-100 text-yellow-600',
    purple: 'border-purple-500 bg-purple-100 text-purple-500',
  };

  const colorClass = colors[color] || colors.blue;

  if (loading) return <div className="bg-white dark:bg-gray-800 p-4 rounded shadow animate-pulse h-24"></div>;

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center border-l-4 ${colorClass.split(' ')[0]}`}>
      <div className={`p-3 rounded-full mr-4 text-xl ${colorClass.split(' ').slice(1).join(' ')}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
