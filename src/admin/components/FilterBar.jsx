import React from 'react';

const FilterBar = ({ onSearch, onFilterChange, filterOptions = [], placeholder = "Search..." }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        {filterOptions.map((option, idx) => (
          <select
            key={idx}
            onChange={(e) => onFilterChange(option.key, e.target.value)}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{option.label}</option>
            {option.options.map((opt, optIdx) => (
              <option key={optIdx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
