import React from 'react';

const Pagination = ({ pagination, setCurrentPage }) => {
  if (!pagination || pagination.totalRecords === 0) {
    return null;
  }

  const { currentPage, totalPages, totalRecords } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 6;
    
    if (totalPages <= maxVisible) {
      for(let i = 1; i <= totalPages; i++){
        pages.push(i);
      }
    }else{
      if(currentPage <= 4) {
        for(let i = 1; i <= maxVisible; i++){
          pages.push(i);
        }
      }
      else if(currentPage >= totalPages - 3){
        for(let i = totalPages - maxVisible + 1; i <= totalPages; i++){
          pages.push(i);
        }
      }
      else{
        for(let i = currentPage - 2; i <= currentPage + 3; i++){
          pages.push(i);
        }
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center px-6 py-5 bg-white border-t border-gray-200 flex-wrap gap-4">
      <div className="text-sm text-gray-600">
        Total Records: <strong className="text-gray-900 font-semibold">{totalRecords.toLocaleString()}</strong>
      </div>
      
      <div className="flex items-center gap-2">
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            className={`min-w-[36px] h-9 px-3 rounded border transition-all text-sm flex items-center justify-center ${
              currentPage === pageNum
                ? 'bg-blue-500 border-blue-500 text-white font-semibold'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-blue-500'
            }`}
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
