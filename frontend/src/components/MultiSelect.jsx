import React, { useState } from 'react';

const MultiSelect = ({ placeholder, options, selectedValues, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const displayText = selectedValues.length > 0 
    ? `${selectedValues.length} selected`
    : placeholder;

  console.log(`MultiSelect ${placeholder}:`, {
    isOpen,
    optionsCount: options?.length || 0,
    optionsPreview: options?.slice(0, 3),
    selectedCount: selectedValues.length
  });

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          console.log('Clicked!', newIsOpen, 'Options:', options?.length);
        }}
        className="relative z-20 w-full h-[38px] px-3 bg-[#F3F3F3] border border-gray-300 rounded text-sm text-left flex items-center justify-between hover:border-blue-500"
      >
        <span className={selectedValues.length ? 'text-gray-900 font-medium' : 'text-gray-500'}>
          {displayText}
        </span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && options && options.length > 0 && (
        <>
          {console.log('DROPDOWN RENDERING with', options.length, 'options')}
          <div 
            className="absolute z-[9999] w-full mt-1 bg-white border-4 border-red-500 rounded shadow-2xl max-h-60 overflow-auto"
            style={{ position: 'absolute', top: '40px', left: 0, right: 0 }}
          >
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-2 bg-white hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  console.log('Option clicked:', option);
                  handleToggle(option);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  readOnly
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-900">{option}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!isOpen && console.log('Dropdown closed')}
      {isOpen && (!options || options.length === 0) && console.log('No options available')}

      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedValues.slice(0, 3).map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {val}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(selectedValues.filter(v => v !== val));
                }}
                className="font-bold hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          ))}
          {selectedValues.length > 3 && (
            <span className="px-2 py-1 bg-gray-200 text-xs rounded">
              +{selectedValues.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
