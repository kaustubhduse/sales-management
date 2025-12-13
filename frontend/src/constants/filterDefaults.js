// Static filter options for instant UI rendering
// These values are updated periodically and provide instant loading
export const DEFAULT_FILTER_OPTIONS = {
  customerRegions: ['North', 'South', 'East', 'West'],
  genders: ['Male', 'Female', 'Non-Binary'],
  productCategories: ['Electronics', 'Clothing', 'Beauty', 'Accessories', 'Home & Living'],
  tags: ['organic', 'skincare', 'portable', 'wireless', 'gadgets', 'unisex', 'cotton', 'formal', 'makeup', 'beauty', 'fragrance-free'],
  paymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'UPI'],
  ageRange: {
    min: 18,
    max: 70
  }
};
