import React from 'react';

const MetricCard = ({ label, value, iconSrc = "/image.png" }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 inline-flex flex-col min-w-fit">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-md text-gray-600 whitespace-nowrap">{label}</span>
      <img src={iconSrc} alt="icon" className="w-5 h-5" />
    </div>
    <div className="text-xl font-bold text-gray-900 mb-0.5 whitespace-nowrap">{value}</div>
  </div>
);

const MetricsCards = ({ salesData }) => {
  const calculateMetrics = () => {
    if (!salesData || salesData.length === 0) {
      return {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0
      };
    }

    const totalUnits = salesData.reduce((sum, record) => sum + (record.quantity || 0), 0);
    const totalAmount = salesData.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
    const totalDiscount = salesData.reduce((sum, record) => sum + (record.finalAmount - record.totalAmount || 0), 0);

    return {
      totalUnits,
      totalAmount: Math.abs(totalAmount),
      totalDiscount: Math.abs(totalDiscount)
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-IN')}`;
  };

  const metricsConfig = [
    { label: 'Total units sold', value: metrics.totalUnits.toLocaleString() },
    { label: 'Total Amount', value: formatCurrency(metrics.totalAmount) },
    { label: 'Total Discount', value: formatCurrency(metrics.totalDiscount) }
  ];

  return (
    <div className="flex gap-[2%] mb-3">
      {metricsConfig.map((metric, index) => (
        <MetricCard key={index} label={metric.label} value={metric.value} />
      ))}
    </div>
  );
};

export default MetricsCards;
