import React from 'react';

const SortingDropdown = ({ sortBy, order, setSortBy, setOrder }) => {
  const handleChange = (e) => {
    const [newSortBy, newOrder] = e.target.value.split('-');
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  const currentValue = `${sortBy}-${order}`;

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
        Sort by:
      </label>
      <select
        className="px-3 py-2 pr-10 border border-gray-300 rounded bg-white text-gray-900 text-sm cursor-pointer appearance-none bg-no-repeat min-w-[160px] focus:outline-none focus:border-blue-500"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center'
        }}
        value={currentValue}
        onChange={handleChange}
      >
        <option value="date-desc">Date (Newest First)</option>
        <option value="quantity-desc">Quantity</option>
        <option value="customerName-asc">Customer Name (A-Z)</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
