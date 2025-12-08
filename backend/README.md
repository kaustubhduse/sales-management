# TruEstate Backend

Backend API for the Retail Sales Management System.

## Tech Stack

- Node.js
- Express.js
- CSV Parser

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
PORT=5000
CSV_PATH=../sales_data.csv
```

3. Run the server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### GET /api/sales

Get sales data with search, filters, sorting, and pagination.

**Query Parameters:**
- `search` - Search by customer name or phone number
- `customerRegion` - Filter by regions (comma-separated)
- `gender` - Filter by gender (comma-separated)
- `minAge`, `maxAge` - Age range filter
- `productCategory` - Filter by categories (comma-separated)
- `tags` - Filter by tags (comma-separated)
- `paymentMethod` - Filter by payment methods (comma-separated)
- `startDate`, `endDate` - Date range filter
- `sortBy` - Sort field (date, quantity, customerName)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)

**Example:**
```
GET /api/sales?search=john&customerRegion=North&sortBy=date&page=1
```

### GET /api/filters

Get all available filter options.

**Response:**
```json
{
  "success": true,
  "filters": {
    "customerRegions": ["North", "South", ...],
    "genders": ["Male", "Female"],
    "productCategories": ["Electronics", ...],
    "tags": [...],
    "paymentMethods": ["Cash", "Card", ...],
    "ageRange": { "min": 18, "max": 80 }
  }
}
```

## Architecture

- `src/index.js` - Server entry point
- `src/routes/` - API route definitions
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/utils/` - Utility functions
