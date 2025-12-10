# Sales Management System

A full-stack sales data management application with advanced search, filtering, sorting, and pagination capabilities. Built with React, Node.js, Express, and PostgreSQL, handling 2M+ transaction records with optimized performance through database indexing and Redis caching.

**Live Demo:** [https://sales-management-pied.vercel.app/](https://sales-management-pied.vercel.app/)  
**Backend API:** [https://sales-management-g461.onrender.com/](https://sales-management-g461.onrender.com)

---

## Architecture

For detailed system architecture, backend/frontend design, data flow diagrams, and folder structure, refer to [Architecture Documentation](docs/architecture.md).

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (2M+ records)
- **Caching:** Redis (Upstash)
- **Deployment:** Render

### Performance Optimizations
- Redis caching for filter options (1-hour TTL)
- PostgreSQL indexes (B-Tree, GIN) for fast queries
- React Query for client-side caching
- Debounced search (500ms)
- Rate limiting (100 req/min)

---

## Search Implementation Summary

**Full-Text Search with PostgreSQL GIN Index**

- **Method:** Uses `to_tsvector` with GIN index for fast text search across `customer_name` and `phone_number` fields
- **Pattern Matching:** Supports partial matches with `ILIKE` for flexible searching
- **Debouncing:** 500ms delay to reduce API calls while typing
- **Index:** `idx_customer_search` (GIN) - reduces search time from 5s to <50ms on 2M rows

**Frontend Implementation:**
- Custom `useDebounce` hook prevents excessive API calls
- Real-time search results update as user types
- Search integrates seamlessly with active filters

---

## Filter Implementation Summary

**Multi-Select Filters with Array-Based Queries**

Supports 6 filter categories:
1. **Customer Region** - Uses `= ANY(array)` for exact matches
2. **Gender** - Uses `= ANY(array)` for exact matches
3. **Age Range** - Multi-select ranges (18-25, 26-35, etc.) with OR conditions
4. **Product Category** - Uses `= ANY(array)` for exact matches
5. **Tags** - Uses `ILIKE` with GIN index for pattern matching
6. **Payment Method** - Uses `= ANY(array)` for exact matches

**Backend:**
- Dynamic WHERE clause construction with parameterized queries (SQL injection prevention)
- Comma-separated query params converted to arrays
- Optimized with B-Tree indexes on filter columns

**Frontend:**
- Native HTML multi-select dropdowns (Ctrl/Cmd + Click)
- Selected filters displayed as removable chips
- Filter state managed in React with `useState`

**Caching:**
- Filter options cached in Redis for 1 hour
- First request: ~5s (database query)
- Subsequent requests: <10ms (Redis cache hit)

---

## Sorting Implementation Summary

**Multi-Column Sorting with Indexed Queries**

**Supported Sort Fields:**
- Date (default: DESC)
- Quantity
- Total Amount
- Final Amount
- Customer Name

**Implementation:**
- **Backend:** Dynamic `ORDER BY` clause construction
- **Indexes:** 
  - `idx_date` - Optimized for date sorting (DESC)
  - `idx_metrics` - Composite index on quantity, total_amount, final_amount
- **Frontend:** Dropdown with sort field + order (ASC/DESC) selection
- **Performance:** <100ms for sorted queries on 2M rows

**SQL Example:**
```sql
SELECT * FROM sales 
WHERE customer_region = ANY($1) 
ORDER BY date DESC 
LIMIT 10 OFFSET 0;
```

---

## Pagination Implementation Summary

**Server-Side Pagination with Offset-Based Strategy**

**Configuration:**
- Page size: 10 records (configurable)
- Metadata: Total records, total pages, current page, has next/previous

**Backend:**
- Uses `LIMIT` and `OFFSET` for pagination
- Separate `COUNT(*)` query for total records (optimized with indexes)
- Returns pagination metadata with every response

**Frontend:**
- Fixed pagination bar at bottom of screen
- Shows current page, total pages, and navigation buttons
- Jump to specific page functionality
- Maintains filter/search/sort state during pagination

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Initialize database using Node.js (run once)
node -e "const {Client}=require('pg');const c=new Client({user:'postgres',password:'root',host:'localhost',port:5432});c.connect().then(()=>c.query('CREATE DATABASE sales_management')).then(()=>{console.log('Database created');c.end()}).catch(e=>console.log(e.message))"

# Create tables and load data
node database/migrate.js

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Database Migration

The `migrate.js` script:
1. Creates `sales` table with schema
2. Loads CSV data (2M+ records) in batches
3. Creates all indexes automatically
4. Handles duplicate prevention
---

## API Endpoints

### GET `/api/sales`
Fetch sales data with filters, search, sort, and pagination

### GET `/api/filters`
Fetch all available filter options (cached in Redis)

---

**Total Database Size:** ~800MB (2M records + indexes)

---