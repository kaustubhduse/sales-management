-- PostgreSQL Database

DROP TABLE IF EXISTS sales CASCADE;

CREATE TABLE sales (
  transaction_id INTEGER PRIMARY KEY,
  
  customer_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  gender VARCHAR(20),
  age INTEGER,
  customer_region VARCHAR(50),
  customer_type VARCHAR(50),
  
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255),
  brand VARCHAR(100),
  product_category VARCHAR(100),
  tags TEXT,
  
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(10, 2),
  discount_percentage DECIMAL(5, 2),
  total_amount DECIMAL(12, 2) NOT NULL,
  final_amount DECIMAL(12, 2),
  
  date DATE NOT NULL,
  payment_method VARCHAR(50),
  order_status VARCHAR(50),
  delivery_type VARCHAR(50),
  store_id VARCHAR(50),
  store_location VARCHAR(100),
  salesperson_id VARCHAR(50),
  employee_name VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_name ON sales USING BTREE (customer_name);
CREATE INDEX idx_phone_number ON sales USING BTREE (phone_number);

CREATE INDEX idx_customer_search ON sales USING GIN (
  to_tsvector('english', COALESCE(customer_name, '') || ' ' || COALESCE(phone_number, ''))
);

CREATE INDEX idx_customer_region ON sales (customer_region);
CREATE INDEX idx_gender ON sales (gender);
CREATE INDEX idx_age ON sales (age);
CREATE INDEX idx_product_category ON sales (product_category);
CREATE INDEX idx_payment_method ON sales (payment_method);
CREATE INDEX idx_date ON sales (date DESC);

CREATE INDEX idx_filter_combo ON sales (customer_region, gender, product_category, date DESC);

-- GIN index for tags to speed up ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_tags ON sales USING GIN (tags gin_trgm_ops);

CREATE INDEX idx_metrics ON sales (quantity, total_amount, final_amount);

COMMENT ON TABLE sales IS 'Sales transaction data from CSV file';
COMMENT ON COLUMN sales.transaction_id IS 'Unique transaction identifier';
COMMENT ON COLUMN sales.customer_name IS 'Customer full name (searchable)';
COMMENT ON COLUMN sales.phone_number IS 'Customer phone number (searchable)';
COMMENT ON COLUMN sales.tags IS 'Comma-separated product tags';

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'sales'
ORDER BY indexname;
