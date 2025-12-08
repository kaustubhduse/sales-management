import { query } from '../config/db.js';
import { buildSearchClause } from './searchService.js';
import { buildFilterClause } from './filterService.js';
import { buildSortClause } from './sortService.js';
import { buildPaginationClause, getPaginationMetadata, getTotalCount } from './paginationService.js';
import { getFilterOptions } from './filterOptionsService.js';
import { transformSalesRows } from './transformService.js';


export const getSalesData = async (searchQuery, filters, sortBy, order, page, pageSize) => {
  try{
    const whereClauses = [];
    let params = [];
    let paramIndex = 1;
    if(searchQuery){
      const search = buildSearchClause(searchQuery);
      if(search.clause){
        whereClauses.push(search.clause);
        params.push(...search.params);
        paramIndex += search.params.length;
      }
    }
    const filterResult = buildFilterClause(filters);
    if(filterResult.clause){
      let adjustedClause = filterResult.clause;
      filterResult.params.forEach((param, idx) => {
        const oldParam = `$${idx + 1}`;
        const newParam = `$${paramIndex + idx}`;
        adjustedClause = adjustedClause.replace(new RegExp('\\' + oldParam + '(?!\\d)', 'g'), newParam);
      });
      
      whereClauses.push(adjustedClause);
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
