import React, { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange]);

  return (
    <div className="max-w-md w-96">
      <div className="relative flex items-center">
        <svg className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="w-full pl-12 pr-10 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400"
          placeholder="Search by Name, Phone etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-3 bg-transparent text-gray-400 px-2 py-1 rounded hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
