import React from 'react';

const TransactionTable = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-16 px-8 text-gray-600">
        <div className="w-12 h-12 mx-auto mb-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p>Loading sales data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 px-8 text-gray-600">
        <div className="text-5xl mb-4 opacity-30">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Transaction ID</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Date</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Customer ID</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Customer Name</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Phone Number</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Gender</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Age</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Product Category</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Quantity</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Total Amount</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Customer Region</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Product ID</th>
              <th className="px-4 py-4 text-left font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap text-xs uppercase tracking-wide">Employee Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={`${record.transactionId}-${index}`} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.transactionId}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.customerId}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900 font-medium">{record.customerName}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.phoneNumber}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.gender}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.age}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.productCategory}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900 font-semibold">{record.quantity}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900 font-semibold">₹{record.totalAmount?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.customerRegion}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.productId}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-gray-900">{record.employeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
