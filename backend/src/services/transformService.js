
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};


const numericFields = [
  'age',
  'quantity',
  'pricePerUnit',
  'discountPercentage',
  'totalAmount',
  'finalAmount'
];


export const transformSalesRow = (row) => {
  const transformed = {};
  for (const key in row){
    const camelKey = toCamelCase(key);
    let value = row[key];
    
    if (numericFields.includes(camelKey) && value !== null){
      value = parseFloat(value);
    }
    
    transformed[camelKey] = value;
  }
  return transformed;
};

export const transformSalesRows = (rows) => {
  return rows.map(transformSalesRow);
};
