import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const checkIndex = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:root@localhost:5432/sales_management'
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    // Check for GIN index
    const result = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'sales' 
      AND indexname = 'idx_customer_search'
    `);

    if (result.rows.length > 0) {
      console.log('*** GIN INDEX EXISTS ***');
      console.log(result.rows[0].indexdef);
      console.log('\nSearch should be fast (<50ms)');
    } else {
      console.log('*** GIN INDEX MISSING ***');
      console.log('\nThis explains the 8-9 second search time!');
      console.log('\nOptions to fix:');
      console.log('1. Run: node database/migrate.js (will recreate DB with all indexes)');
      console.log('2. Or manually create index - see instructions below\n');
    }

    // Show all indexes
    console.log('\nAll indexes on sales table:');
    const allIndexes = await client.query(`
      SELECT indexname FROM pg_indexes WHERE tablename = 'sales' ORDER BY indexname
    `);
    allIndexes.rows.forEach(row => console.log('  -', row.indexname));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
};

checkIndex();
