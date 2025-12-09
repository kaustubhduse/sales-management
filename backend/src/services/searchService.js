import { query } from '../config/db.js';


export const searchSales = async (searchQuery) => {
  if(!searchQuery || searchQuery.trim() === ''){
    return null;
  }

  const searchTerm = searchQuery.trim();
  
  const sql = `
    SELECT * FROM sales
    WHERE 
      customer_name ILIKE $1 
      OR phone_number ILIKE $1
  `;  
  
  const result = await query(sql, [`%${searchTerm}%`]);
  return result.rows;
};

export const buildSearchClause = (searchQuery) => {
  if(!searchQuery || searchQuery.trim() === ''){
    return {clause: '', params: []};
  }

  const searchTerm = searchQuery.trim();
  
  return{
    clause: `(to_tsvector('english', COALESCE(customer_name, '') || ' ' || COALESCE(phone_number, '')) @@ plainto_tsquery('english', $1))`,
    params: [searchTerm]
  };
};
