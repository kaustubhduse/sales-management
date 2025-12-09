import { query } from '../config/db.js';
import { getCached, setCache } from './cacheService.js';

/**
 * Get all unique filter options from the database
 * Cached for 1 hour since filter options change rarely
 */
export const getFilterOptions = async () => {
  const cacheKey = 'filter_options';
  
  const cached = await getCached(cacheKey);
  if(cached){
    console.log('Returning cached filter options');
    return cached;
  }
  
  console.log('Querying database for filter options...');
  
  try {
    // Get unique customer regions
    const regionsResult = await query(`
      SELECT DISTINCT customer_region 
      FROM sales 
      WHERE customer_region IS NOT NULL 
      ORDER BY customer_region
    `);

    // Get unique genders
    const gendersResult = await query(`
      SELECT DISTINCT gender 
      FROM sales 
      WHERE gender IS NOT NULL 
      ORDER BY gender
    `);

    // Get unique product categories
    const categoriesResult = await query(`
      SELECT DISTINCT product_category 
      FROM sales 
      WHERE product_category IS NOT NULL 
      ORDER BY product_category
    `);

    // Get unique payment methods
    const paymentMethodsResult = await query(`
      SELECT DISTINCT payment_method 
      FROM sales 
      WHERE payment_method IS NOT NULL 
      ORDER BY payment_method
    `);

    // Get min and max age
    const ageRangeResult = await query(`
      SELECT MIN(age) as min_age, MAX(age) as max_age 
      FROM sales
    `);

    // Get unique tags (optimized - limit sample size to avoid full table scan)
    // For 2M+ rows, unnest on entire table is too expensive
    const tagsResult = await query(`
      SELECT DISTINCT unnest(string_to_array(tags, ',')) as tag
      FROM sales 
      WHERE tags IS NOT NULL
      LIMIT 10000
    `);
    
    // Fallback to common tags to ensure UI works even if query is slow
    const commonTags = ['organic', 'skincare', 'portable', 'wireless', 'gadgets', 'unisex', 'cotton', 'formal', 'makeup', 'beauty', 'fragrance-free'];
    
    const uniqueTags = tagsResult.rows.length > 0
      ? [...new Set([
          ...tagsResult.rows.map(row => row.tag ? row.tag.trim() : null).filter(tag => tag),
          ...commonTags
        ])].sort()
      : commonTags;

    const filterOptions = {
      customerRegions: regionsResult.rows.map(r => r.customer_region),
      genders: gendersResult.rows.map(r => r.gender),
      productCategories: categoriesResult.rows.map(r => r.product_category),
      tags: uniqueTags,
      paymentMethods: paymentMethodsResult.rows.map(r => r.payment_method),
      ageRange:{
        min: ageRangeResult.rows[0].min_age || 0,
        max: ageRangeResult.rows[0].max_age || 100
      }
    };
    
    // Cache for 1 hour (3600 seconds)
    await setCache(cacheKey, filterOptions, 3600);
    console.log('Cached filter options for 1 hour');
    
    return filterOptions;
  }
  catch(error){
    console.error('Error fetching filter options:', error);
    throw error;
  }
};