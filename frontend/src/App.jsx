import React from 'react';
import { useSalesData } from './hooks/useSalesData';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import MetricsCards from './components/MetricsCards';
import SortingDropdown from './components/SortingDropdown';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';

function App() {
  const {
    salesData,
    filterOptions,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    sortBy,
    setSortBy,
    order,
    setOrder,
    setCurrentPage
  } = useSalesData();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - no margin on mobile, left margin on desktop */}
      <div className="md:ml-60 flex-1 min-h-screen max-w-full md:max-w-[calc(100vw-15rem)] overflow-x-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 m-0">Sales Management System</h1>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
          />
        </div>

        <div className="p-8 pb-24">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="flex justify-between items-start mb-3 gap-4">
            <FilterBar
              filters={filters}
              updateFilter={updateFilter}
              filterOptions={filterOptions}
            />
            <SortingDropdown
              sortBy={sortBy}
              order={order}
              setSortBy={setSortBy}
              setOrder={setOrder}
            />
          </div>

          <MetricsCards salesData={salesData} />

          <div className="overflow-x-auto -mx-8 px-8">
            <TransactionTable 
              data={salesData} 
              loading={loading} 
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-60 right-0 z-10">
          <Pagination
            pagination={pagination}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
