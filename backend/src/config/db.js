import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false},
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  maxUses: 7500,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text, params) =>{
  const start = Date.now();
  try{
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if(process.env.DEBUG === 'true'){
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } 
  catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export {pool};
export default pool;
