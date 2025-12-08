/**
 * Build SQL WHERE clause for filtering
 * Generates dynamic SQL based on provided filters
 */
export const buildFilterClause = (filters) => {
  const conditions = [];  
  const params = [];
  let paramIndex = 1;

  // Customer Region filter
  if(filters.customerRegion && filters.customerRegion.length > 0){
    conditions.push(`customer_region = ANY($${paramIndex})`);
    params.push(filters.customerRegion);
    paramIndex++;
  }

  // Gender filter
  if(filters.gender && filters.gender.length > 0){
    conditions.push(`gender = ANY($${paramIndex})`);
    params.push(filters.gender);
    paramIndex++;
  }

  // Age Range filter (supports both old minAge/maxAge and new ageRanges)
  if(filters.ageRanges && filters.ageRanges.length > 0) {
    // Handle multiple age range selections like ['18-25', '26-35']
    const ageRangeConditions = filters.ageRanges.map(range => {
      if(range === '66+') {
        return `age >= 66`;
      }
      const [min, max] = range.split('-').map(Number);
      return `(age >= ${min} AND age <= ${max})`;
    });
    conditions.push(`(${ageRangeConditions.join(' OR ')})`);
  } else if(filters.minAge !== undefined || filters.maxAge !== undefined) {
    // Fallback to old min/max age filter
    const minAge = filters.minAge !== undefined ? parseInt(filters.minAge) : 0;
    const maxAge = filters.maxAge !== undefined ? parseInt(filters.maxAge) : 150;
    conditions.push(`age >= $${paramIndex} AND age <= $${paramIndex + 1}`);
    params.push(minAge, maxAge);
    paramIndex += 2;
  }

  // Product Category filter
  if(filters.productCategory && filters.productCategory.length > 0){
    conditions.push(`product_category = ANY($${paramIndex})`);
    params.push(filters.productCategory);
    paramIndex++;
  }

  // Tags filter
  if(filters.tags && filters.tags.length > 0){
    const tagConditions = filters.tags.map(tag => {
      const currentParam = paramIndex++;
      params.push(`%${tag}%`);
      return `tags ILIKE $${currentParam}`;
    });
    conditions.push(`(${tagConditions.join(' OR ')})`);
  }

  // Payment Method filter
  if(filters.paymentMethod && filters.paymentMethod.length > 0){
    conditions.push(`payment_method = ANY($${paramIndex})`);
    params.push(filters.paymentMethod);
    paramIndex++;
  }

  // Date Range filter
  if(filters.startDate || filters.endDate){
    const startDate = filters.startDate || '1900-01-01';
    const endDate = filters.endDate || '2100-12-31';
    conditions.push(`date >= $${paramIndex} AND date <= $${paramIndex + 1}`);
    params.push(startDate, endDate);
    paramIndex += 2;
  }

  return{
    clause: conditions.length > 0 ? conditions.join(' AND ') : '',
    params,
    paramIndex
  };
};
