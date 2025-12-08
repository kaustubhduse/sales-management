import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, updateFilter, clearFilters, filterOptions }) => {
  if (!filterOptions) {
    return <div className="card">Loading filters...</div>;
  }

  const handleMultiSelect = (filterName, value) => {
    const currentValues = filters[filterName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(filterName, newValues);
  };

  return (
    <div className="filter-panel card">
      <div className="filter-header">
        <h3 className="card-header">Filters</h3>
        <button onClick={clearFilters} className="btn-clear-all">
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label className="filter-label">Customer Region</label>
        <div className="filter-options">
          {filterOptions.customerRegions.map(region => (
            <label key={region} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.customerRegion.includes(region)}
                onChange={() => handleMultiSelect('customerRegion', region)}
              />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Gender</label>
        <div className="filter-options">
          {filterOptions.genders.map(gender => (
            <label key={gender} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.gender.includes(gender)}
                onChange={() => handleMultiSelect('gender', gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Age Range</label>
        <div className="age-range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minAge}
            onChange={(e) => updateFilter('minAge', e.target.value)}
            min={filterOptions.ageRange.min}
            max={filterOptions.ageRange.max}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAge}
            onChange={(e) => updateFilter('maxAge', e.target.value)}
            min={filterOptions.ageRange.min}
            max={filterOptions.ageRange.max}
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Product Category</label>
        <div className="filter-options scrollable">
          {filterOptions.productCategories.map(category => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.productCategory.includes(category)}
                onChange={() => handleMultiSelect('productCategory', category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Payment Method</label>
        <div className="filter-options">
          {filterOptions.paymentMethods.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.paymentMethod.includes(method)}
                onChange={() => handleMultiSelect('paymentMethod', method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Date Range</label>
        <div className="date-range-inputs">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
