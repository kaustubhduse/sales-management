import { query } from '../config/db.js';


export const buildPaginationClause = (page = 1, pageSize = 10) => {
  const limit = parseInt(pageSize) || 10;
  const offset = (parseInt(page) - 1)*limit;
  
  return{
    clause: `LIMIT ${limit} OFFSET ${offset}`,
    limit,
    offset
  };
};


export const getPaginationMetadata = async (totalRecords, page = 1, pageSize = 10) => {
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const totalPages = Math.ceil(totalRecords / size);

  return{
    currentPage,
    pageSize: size,
    totalRecords,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};


export const getTotalCount = async (whereClause, params) => {
  const sql = `
    SELECT COUNT(*) as total
    FROM sales
    ${whereClause ? `WHERE ${whereClause}` : ''}
  `;
  
  const result = await query(sql, params);
  return parseInt(result.rows[0].total);
};