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

  // Age Range filter
  if(filters.minAge !== undefined || filters.maxAge !== undefined){
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
    const tagConditions = filters.tags.map((tag, idx) => {
      params.push(`%${tag}%`);
      return `tags ILIKE $${paramIndex + idx}`;
    });
    conditions.push(`(${tagConditions.join(' OR ')})`);
    paramIndex += filters.tags.length;
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
