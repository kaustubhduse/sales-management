export const buildSortClause = (sortBy, order = 'desc') => {
  if(!sortBy){
    return 'ORDER BY transaction_id DESC';
  }

  const orderDirection = order === 'asc' ? 'ASC' : 'DESC';

  switch(sortBy){
    case 'date':
      return `ORDER BY date ${orderDirection}, transaction_id ${orderDirection}`;
    
    case 'quantity':
      return `ORDER BY quantity ${orderDirection}, transaction_id DESC`;
    
    case 'customerName':
      return `ORDER BY customer_name ${orderDirection}, transaction_id DESC`;
    
    default:
      return 'ORDER BY transaction_id DESC';
  }
};
