import { query } from '../config/db.js';
import { buildSearchClause } from './searchService.js';
import { buildFilterClause, buildFilterClauseWithIndex } from './filterService.js';
import { buildSortClause } from './sortService.js';
import { buildPaginationClause, getPaginationMetadata, getTotalCount } from './paginationService.js';
import { getFilterOptions } from './filterOptionsService.js';
import { transformSalesRows } from './transformService.js';


export const getSalesData = async (searchQuery, filters, sortBy, order, page, pageSize) => {
  try{
    const whereClauses = [];
    let params = [];
    let paramIndex = 1;
    
    // Add search clause
    if(searchQuery){
      const search = buildSearchClause(searchQuery);
      if(search.clause){
        whereClauses.push(search.clause);
        params.push(...search.params);
        paramIndex += search.params.length;
      }
    }
    
    // Add filter clauses - pass paramIndex so filters build with correct indices
    const filterResult = buildFilterClauseWithIndex(filters, paramIndex);
    if(filterResult.clause){
      whereClauses.push(filterResult.clause);
      params.push(...filterResult.params);
      paramIndex += filterResult.params.length;
    }

    const whereClause = whereClauses.length > 0 ? whereClauses.join(' AND ') : '';
    const totalRecords = await getTotalCount(whereClause, params);
    const sortClause = buildSortClause(sortBy, order);
    const paginationClause = buildPaginationClause(page, pageSize);

    const sql = `
      SELECT *
      FROM sales
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ${sortClause}
      ${paginationClause.clause}
    `;

    const result = await query(sql, params);

    const transformedData = transformSalesRows(result.rows);

    const pagination = await getPaginationMetadata(totalRecords, page, pageSize);

    return {
      data: transformedData,
      pagination
    };
  } catch (error) {
    console.error('Error getting sales data:', error);
    throw error;
  }
};


export const getFilterOptionsFromData = async () => {
  return await getFilterOptions();
};

export { getFilterOptions };
