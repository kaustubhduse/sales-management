# System Architecture

## Overview

The TruEstate Retail Sales Management System is a full-stack web application designed to handle large-scale sales data with advanced filtering, searching, sorting, and pagination capabilities. The architecture follows clean separation of concerns with a RESTful API backend and a modern React frontend.

## System Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 5173)              │  │
│  │                                                       │  │
│  │  Components → Hooks → Services → API Client         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express.js Backend (Port 5000)             │  │
│  │                                                       │  │
│  │  Routes → Controllers → Services → Data Layer       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        CSV Data (In-Memory / File System)            │  │
│  │                                                       │  │
│  │  ~500,000 sales records loaded at startup           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Data Processing**: csv-parser library
- **Data Storage**: In-memory (for fast access)

### Module Responsibilities

#### 1. Entry Point (`src/index.js`)
**Purpose**: Bootstrap the Express application

**Responsibilities**:
- Load environment variables
- Initialize Express middleware (CORS, JSON parser)
- Load CSV data into memory on startup
- Mount API routes
- Start HTTP server
- Global error handling

**Key Logic**:
```javascript
startServer()
  → loadSalesData(CSV_PATH)
  → app.listen(PORT)
```

---

#### 2. Routes (`src/routes/salesRoutes.js`)
**Purpose**: Define API endpoints

**Endpoints**:
- `GET /api/sales` - Main data endpoint
- `GET /api/filters` - Filter options endpoint

**Routing Flow**:
```
HTTP Request → Router → Controller → Service → Response
```

---

#### 3. Controllers (`src/controllers/salesController.js`)
**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Parse query parameters
- Validate input
- Call appropriate service methods
- Format response
- Handle errors

**Methods**:
- `getSales(req, res)` - Process sales data request
- `getFilters(req, res)` - Return filter options

**Query Parameters Processed**:
```javascript
{
  search: string,
  customerRegion: string[],
  gender: string[],
  minAge: number,
  maxAge: number,
  productCategory: string[],
  tags: string[],
  paymentMethod: string[],
  startDate: date,
  endDate: date,
  sortBy: 'date' | 'quantity' | 'customerName',
  order: 'asc' | 'desc',
  page: number,
  pageSize: number
}
```

---

#### 4. Services (`src/services/dataService.js`)
**Purpose**: Core business logic

**Responsibilities**:
- Load and parse CSV data
- Implement search algorithm
- Implement filter logic
- Implement sorting logic
- Implement pagination logic
- Extract filter options

**Methods**:

**`loadSalesData(csvPath)`**
- Reads CSV file
- Parses and transforms data
- Stores in memory
- Returns promise

**`searchSales(data, query)`**
- Case-insensitive search
- Searches customerName and phoneNumber fields
- Uses JavaScript `includes()` for matching
- Returns filtered array

**`filterSales(data, filters)`**
- Applies multiple filters with AND logic
- Supports multi-select (arrays)
- Supports range filters (age, date)
- Returns filtered array

**Algorithm**:
```javascript
data → filter(customerRegion) 
     → filter(gender) 
     → filter(age range) 
     → filter(productCategory) 
     → filter(tags) 
     → filter(paymentMethod) 
     → filter(date range) 
     → return result
```

**`sortSales(data, sortBy, order)`**
- Sorts by specified field
- Uses JavaScript native sort with custom comparators
- Supports ascending/descending order
- Returns sorted array

**`paginateSales(data, page, pageSize)`**
- Slices data array based on page number
- Calculates pagination metadata
- Returns object with data and pagination info

**`getFilterOptions()`**
- Extracts unique values from dataset
- Returns all available filter options
- Cached from in-memory data

---

#### 5. Utilities (`src/utils/csvLoader.js`)
**Purpose**: CSV file processing

**Responsibilities**:
- Read CSV file from filesystem
- Parse CSV rows
- Transform data to application format
- Handle data type conversions
- Error handling for malformed data

**Data Transformation**:
```
CSV Row → Parse → Type Conversion → Validation → Record Object
```

---

### Data Flow

**Request Flow for GET /api/sales**:
```
1. Client sends request with query params
   ↓
2. Express routes to salesController.getSales()
   ↓
3. Controller parses and validates parameters
   ↓
4. Controller calls dataService methods in sequence:
   a. searchSales() - filter by search query
   b. filterSales() - apply all filters
   c. sortSales() - sort results
   d. paginateSales() - paginate results
   ↓
5. Controller formats response
   ↓
6. Express sends JSON response to client
```

**Performance Characteristics**:
- O(n) for search and filtering operations
- O(n log n) for sorting
- O(1) for pagination (array slice)
- Total: O(n log n) per request

**Optimization Strategy**:
- Data loaded once at startup (not per request)
- In-memory operations for fast access
- Efficient array methods (filter, sort, slice)
- Returns only requested page to minimize network transfer

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: Custom hooks + React hooks

### Component Hierarchy

```
App (Root)
├── SearchBar
├── FilterPanel
│   ├── Region Filter (multi-select)
│   ├── Gender Filter (multi-select)
│   ├── Age Range Filter
│   ├── Category Filter (multi-select)
│   ├── Payment Method Filter (multi-select)
│   └── Date Range Filter
├── SortingDropdown
├── TransactionTable
│   ├── Table Header
│   └── Table Rows (10 per page)
└── Pagination
    ├── Previous Button
    ├── Page Info
    └── Next Button
```

### Module Responsibilities

#### 1. Main App (`src/App.jsx`)
**Purpose**: Root component orchestrating all features

**Responsibilities**:
- Use `useSalesData` hook for state management
- Render all child components
- Pass props and callbacks to children
- Display loading and error states

**State Management**:
- All state managed through `useSalesData` hook
- Props passed down to children
- Callbacks for state updates

---

#### 2. Custom Hook (`src/hooks/useSalesData.js`)
**Purpose**: Centralized state and logic management

**State Variables**:
```javascript
{
  salesData: [],                 // Current page data
  filterOptions: {},            // Available filter options
  loading: boolean,             // Loading state
  error: string,                // Error message
  pagination: {},               // Pagination metadata
  searchQuery: string,          // Search input
  filters: {},                  // Active filters
  sortBy: string,               // Sort field
  order: string,                // Sort order
  currentPage: number           // Current page number
}
```

**Effects**:
- Load filter options on mount
- Fetch sales data when parameters change
- Debounced search (handled in SearchBar)

**Methods**:
- `updateFilter()` - Update a specific filter
- `clearFilters()` - Reset all filters
- `goToNextPage()` - Navigate to next page
- `goToPreviousPage()` - Navigate to previous page
- `refresh()` - Reload data

**Data Flow**:
```
User Interaction 
  → Update State (via setter/method) 
  → useEffect triggers 
  → API call 
  → Update salesData 
  → Re-render
```

---

#### 3. API Service (`src/services/api.js`)
**Purpose**: Backend communication layer

**Responsibilities**:
- Configure Axios instance
- Make HTTP requests
- Handle errors
- Transform request/response data

**Methods**:
- `fetchSalesData(params)` - Get sales data
- `fetchFilterOptions()` - Get filter options

**Request Transformation**:
```javascript
{
  filters: {
    customerRegion: ['North', 'South']
  }
} 
→ 
{
  customerRegion: 'North,South'
}
```

---

#### 4. Components

**SearchBar (`src/components/SearchBar.jsx`)**
- Controlled input component
- Debounced search (500ms)
- Clear button
- Icon for visual enhancement

**FilterPanel (`src/components/FilterPanel.jsx`)**
- Sticky sidebar on desktop
- Multi-select checkboxes
- Age range inputs
- Date range inputs
- Clear all button
- Scrollable sections for long lists

**SortingDropdown (`src/components/SortingDropdown.jsx`)**
- Dropdown select
- 6 sort options (3 fields × 2 orders)
- Preserves filter state

**TransactionTable (`src/components/TransactionTable.jsx`)**
- Responsive table
- Displays all 25+ data fields
- Loading spinner
- Empty state
- Status badges with colors
- Horizontal scroll for mobile

**Pagination (`src/components/Pagination.jsx`)**
- Previous/Next buttons
- Current page indicator
- Total records count
- Disabled states

---

### State Management Flow

```
User Action (e.g., select filter)
  ↓
Component calls updateFilter()
  ↓
useSalesData updates filters state
  ↓
useEffect detects filters change
  ↓
loadSalesData() called with new filters
  ↓
API request sent to backend
  ↓
Backend processes request
  ↓
Response received
  ↓
salesData state updated
  ↓
Components re-render with new data
```

---

## Folder Structure

```
TruEstate/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js      # Request handlers
│   │   ├── services/
│   │   │   └── dataService.js          # Business logic
│   │   ├── utils/
│   │   │   └── csvLoader.js            # CSV parsing
│   │   ├── routes/
│   │   │   └── salesRoutes.js          # API routes
│   │   └── index.js                    # Server entry
│   ├── .env                            # Environment variables
│   ├── package.json                    # Dependencies
│   └── README.md                       # Backend docs
│
├── frontend/
│   ├── src/
│   │   ├── components/                 # React components
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchBar.css
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── FilterPanel.css
│   │   │   ├── SortingDropdown.jsx
│   │   │   ├── SortingDropdown.css
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── TransactionTable.css
│   │   │   ├── Pagination.jsx
│   │   │   └── Pagination.css
│   │   ├── hooks/
│   │   │   └── useSalesData.js        # Custom hook
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── styles/
│   │   │   └── global.css             # Global styles
│   │   ├── App.jsx                    # Root component
│   │   └── main.jsx                   # Entry point
│   ├── public/                        # Static assets
│   ├── index.html                     # HTML template
│   ├── vite.config.js                 # Vite config
│   ├── package.json                   # Dependencies
│   └── README.md                      # Frontend docs
│
├── docs/
│   └── architecture.md                # This file
│
├── sales_data.csv                     # Dataset
├── .gitignore                         # Git ignore
└── README.md                          # Main README
```

---

## API Contract

### GET /api/sales

**Request**:
```
GET /api/sales?search=john&customerRegion=North,South&sortBy=date&order=desc&page=1
```

**Query Parameters**:
- `search` (string, optional) - Search term
- `customerRegion` (string, optional) - Comma-separated regions
- `gender` (string, optional) - Comma-separated genders
- `minAge` (number, optional) - Minimum age
- `maxAge` (number, optional) - Maximum age
- `productCategory` (string, optional) - Comma-separated categories
- `tags` (string, optional) - Comma-separated tags
- `paymentMethod` (string, optional) - Comma-separated payment methods
- `startDate` (date, optional) - Start date (YYYY-MM-DD)
- `endDate` (date, optional) - End date (YYYY-MM-DD)
- `sortBy` (string, optional) - Field to sort by (default: 'date')
- `order` (string, optional) - Sort order (default: 'desc')
- `page` (number, optional) - Page number (default: 1)
- `pageSize` (number, optional) - Items per page (default: 10)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "customerId": "C001",
      "customerName": "John Doe",
      "phoneNumber": "1234567890",
      "gender": "Male",
      "age": 35,
      "customerRegion": "North",
      "customerType": "Regular",
      "productId": "P001",
      "productName": "Laptop",
      "brand": "Dell",
      "productCategory": "Electronics",
      "tags": "Tech, Office",
      "quantity": 2,
      "pricePerUnit": 45000,
      "discountPercentage": 10,
      "totalAmount": 90000,
      "finalAmount": 81000,
      "date": "2024-01-15",
      "paymentMethod": "Card",
      "orderStatus": "Delivered",
      "deliveryType": "Express",
      "storeId": "S001",
      "storeLocation": "Delhi",
      "salespersonId": "SP001",
      "employeeName": "Jane Smith"
    }
    // ... 9 more records
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 500000,
    "totalPages": 50000,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### GET /api/filters

**Request**:
```
GET /api/filters
```

**Response**:
```json
{
  "success": true,
  "filters": {
    "customerRegions": ["North", "South", "East", "West"],
    "genders": ["Male", "Female", "Other"],
    "productCategories": ["Electronics", "Clothing", ...],
    "tags": ["Tech", "Fashion", ...],
    "paymentMethods": ["Cash", "Card", "UPI", "Wallet"],
    "ageRange": {
      "min": 18,
      "max": 80
    }
  }
}
```

---

## Design Decisions

### Why In-Memory Data Storage?
**Rationale**: For this assignment scope with a fixed dataset:
- Fast read operations (O(1) access)
- No database setup complexity
- Suitable for demo/assignment purposes
- Can easily migrate to database if needed

**Trade-offs**:
- Memory usage (~500MB for 500K records)
- Data resets on server restart
- Not suitable for write-heavy operations

**Production Alternative**: Use PostgreSQL or MongoDB for persistence, indexing, and scalability.

### Why Client-Side State Management?
**Rationale**:
- Simple custom hook handles all state
- No Redux overhead for this scope
- Easy to understand and maintain
- Sufficient for single-page application

### Why Debounced Search?
**Rationale**:
- Reduces API calls (better performance)
- Improves user experience
- Prevents server overload
- Industry best practice

---

## Performance Considerations

### Backend
- CSV loaded once at startup (not per request)
- In-memory filtering is fast (no DB query overhead)
- Pagination reduces network payload
- Could add caching for filter options (currently recalculated)

### Frontend
- Debounced search (500ms)
- Only fetches current page (10 items)
- React re-renders only when state changes
- CSS for smooth animations

### Scalability Improvements (Future)
- Add database indexing on frequently filtered fields
- Implement server-side caching (Redis)
- Add pagination to filter options
- Lazy load filter options as needed
- Implement virtual scrolling for large result sets

---

## Security Considerations

**Current Implementation**:
- CORS enabled for local development
- Input validation in controllers
- Error messages don't expose internals

**Production Enhancements**:
- Rate limiting on API endpoints
- Input sanitization for SQL injection (if using DB)
- Authentication and authorization
- HTTPS only
- Environment-based CORS configuration

---

## Deployment Architecture

### Backend Deployment (Render/Railway)
```
Git Push → Render/Railway Build → Start npm start → Live API
```

**Environment Variables**:
- `PORT` (provided by platform)
- `CSV_PATH` (relative or absolute)
- `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)
```
Git Push → Vercel Build (vite build) → Deploy Static Files → Live App
```

**Environment Variables**:
- `VITE_API_URL` (production backend URL)

### Production Flow
```
User Browser → CDN (Vercel) → React App
                 ↓ API Calls
              Backend API (Render) → In-Memory Data
```

---

## Testing Strategy

### Backend Testing
- API endpoint tests (manual via Postman/browser)
- Unit tests for service functions (optional)
- Load testing for large datasets

### Frontend Testing
- Manual browser testing
- Responsive design testing
- Cross-browser compatibility
- Edge case testing (no results, boundary pages, etc.)

---

## Conclusion

This architecture provides a clean, maintainable, and scalable solution for the Retail Sales Management System. The separation of concerns between frontend and backend, clear module responsibilities, and professional coding standards make it suitable for both assignment demonstration and as a foundation for future enhancements.
