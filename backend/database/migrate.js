import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const {Client} = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.resolve(__dirname, '../../sales_data.csv');
const BATCH_SIZE = 2000;

async function migrateCsvToPostgres() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {rejectUnauthorized: false}
  });
  
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected successfully!');
    
    console.log('Starting CSV to PostgreSQL migration...');
    console.log(`Reading CSV from: ${CSV_PATH}`);
    
    await client.query('BEGIN');
    
    await client.query('TRUNCATE TABLE sales CASCADE');
    console.log('Cleared existing data');
    
    let batch = [];
    let totalRecords = 0;
    let batchNumber = 0;
    
    const insertBatch = async (records) => {
      if (records.length === 0) return;
      
      const values = [];
      const placeholders = [];
      
      records.forEach((record, idx) => {
        const offset = idx * 26;
        placeholders.push(`($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4},
          $${offset + 5},$${offset + 6},$${offset + 7},$${offset + 8},$${offset + 9},$${offset + 10},
          $${offset + 11},$${offset + 12},$${offset + 13},$${offset + 14},$${offset + 15},
          $${offset + 16},$${offset + 17},$${offset + 18},$${offset + 19},$${offset + 20},
          $${offset + 21},$${offset + 22},$${offset + 23},$${offset + 24},$${offset + 25},
          $${offset + 26})`);
        
        values.push(
          parseInt(record['Transaction ID']) || 0,
          record['Customer ID'],
          record['Customer Name'],
          record['Phone Number'],
          record['Gender'],
          parseInt(record['Age']) || 0,
          record['Customer Region'],
          record['Customer Type'],
          record['Product ID'],
          record['Product Name'],
          record['Brand'],
          record['Product Category'],
          record['Tags'],
          parseInt(record['Quantity']) || 0,
          parseFloat(record['Price per Unit']) || 0,
          parseFloat(record['Discount Percentage']) || 0,
          parseFloat(record['Total Amount']) || 0,
          parseFloat(record['Final Amount']) || 0,
          record['Date'],
          record['Payment Method'],
          record['Order Status'],
          record['Delivery Type'],
          record['Store ID'],
          record['Store Location'],
          record['Salesperson ID'],
          record['Employee Name']
        );
      });
      
      const query = `
        INSERT INTO sales (
          transaction_id, customer_id, customer_name, phone_number, gender, age,
          customer_region, customer_type, product_id, product_name, brand,
          product_category, tags, quantity, price_per_unit, discount_percentage,
          total_amount, final_amount, date, payment_method, order_status,
          delivery_type, store_id, store_location, salesperson_id, employee_name
        ) VALUES ${placeholders.join(', ')}
        ON CONFLICT (transaction_id) DO NOTHING
      `;
      
      await client.query(query, values);
      batchNumber++;
      console.log(`Inserted batch ${batchNumber} (${records.length} records)`);
    };
    
   await new Promise((resolve, reject) => {
      let stream = fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on('data', async (data) => {
          batch.push(data);
          totalRecords++;
          
          if (batch.length >= BATCH_SIZE) {
            stream.pause();
            
            try {
              await insertBatch(batch);
              batch = [];
            } catch (error) {
              return;
            }
            
            stream.resume();
          }
        })
        .on('end', async () => {
          try {
            if (batch.length > 0) {
              await insertBatch(batch);
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
    
    await client.query('COMMIT');
    
    console.log(`\nMigration completed successfully!`);
    console.log(`Total records migrated: ${totalRecords.toLocaleString()}`);
    
    const result = await client.query('SELECT COUNT(*) FROM sales');
    console.log(`Verification: ${result.rows[0].count} records in database`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrateCsvToPostgres()
  .then(() => {
    console.log('\nMigration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration script failed:', error);
    process.exit(1);
  });
