import React from 'react';

const FilterBar = ({ filters, updateFilter, filterOptions }) => {
  if (!filterOptions) {
    return null;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleMultiSelectChange = (filterName, e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    updateFilter(filterName, selectedOptions);
  };

  const LabeledMultiSelect = ({ label, filterName, options, selectedValues }) => {
    return (
      <div className="relative min-w-[150px]">
        <select
          multiple
          size="1"
          value={selectedValues}
          onChange={(e) => handleMultiSelectChange(filterName, e)}
          className="w-full h-[38px] px-3 pr-10 bg-[#F3F3F3] border border-gray-300 rounded text-sm hover:border-blue-500 appearance-none focus:outline-none focus:border-blue-500"
          style={{ 
            color: 'transparent',
            fontWeight: '400'
          }}
        >
          {options?.map(option => (
            <option key={option} value={option} style={{ color: '#111827' }}>{option}</option>
          ))}
        </select>
        <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
          <span className="text-gray-500 text-sm">{label}</span>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center max-w-full overflow-x-hidden">
      <button
        onClick={handleRefresh}
        className="w-10 h-[38px] bg-[#F3F3F3] rounded border border-gray-300 cursor-pointer flex items-center justify-center hover:bg-gray-300 transition-colors"
        title="Refresh"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="#666666"/>
        </svg>
      </button>

      <LabeledMultiSelect
        label="Customer Region"
        filterName="customerRegion"
        options={filterOptions.customerRegions}
        selectedValues={filters.customerRegion || []}
      />

      <LabeledMultiSelect
        label="Gender"
        filterName="gender"
        options={filterOptions.genders}
        selectedValues={filters.gender || []}
      />

      <LabeledMultiSelect
        label="Age Range"
        filterName="ageRanges"
        options={['18-25', '26-35', '36-45', '46-55', '56-65', '66+']}
        selectedValues={filters.ageRanges || []}
      />

      <LabeledMultiSelect
        label="Product Category"
        filterName="productCategory"
        options={filterOptions.productCategories}
        selectedValues={filters.productCategory || []}
      />

      <LabeledMultiSelect
        label="Tags"
        filterName="tags"
        options={['organic', 'skincare', 'portable', 'wireless', 'gadgets', 'unisex', 'cotton', 'formal', 'makeup', 'beauty', 'fragrance-free']}
        selectedValues={filters.tags || []}
      />

      <LabeledMultiSelect
        label="Payment Method"
        filterName="paymentMethod"
        options={filterOptions.paymentMethods}
        selectedValues={filters.paymentMethod || []}
      />

      <input
        type="date"
        className="h-[38px] px-3 bg-[#F3F3F3] border border-gray-300 rounded text-sm"
        value={filters.startDate || ''}
        onChange={(e) => updateFilter('startDate', e.target.value)}
      />

      {Object.entries(filters).some(([key, val]) => Array.isArray(val) && val.length > 0) && (
        <div className="w-full mt-2 flex flex-wrap gap-2">
          {Object.entries(filters).map(([filterName, values]) => (
            Array.isArray(values) && values.length > 0 && (
              <div key={filterName} className="flex flex-wrap gap-1">
                {values.map(value => (
                  <span key={value} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    <span className="font-medium capitalize">{filterName.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                    <button
                      onClick={() => updateFilter(filterName, values.filter(v => v !== value))}
                      className="font-bold hover:text-blue-900"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
