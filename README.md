# TruEstate - Retail Sales Management System

A full-stack web application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Overview

This system processes large-scale retail sales data from a CSV file and provides an intuitive interface for searching, filtering, and analyzing sales transactions. Built with clean architecture and professional coding standards, it demonstrates scalable system design suitable for production environments.

## Tech Stack

**Backend:**
- Node.js & Express.js
- CSV Parser for data processing
- RESTful API architecture

**Frontend:**
- React 18 with Vite
- Axios for API communication
- Custom hooks for state management
- Modern CSS with responsive design

## Search Implementation Summary

The search functionality provides real-time, case-insensitive search across customer names and phone numbers. Implemented with:
- Debounced input (500ms delay) to minimize API calls
- Backend filtering using JavaScript string matching
- Search state persists across filter and sort operations
- Returns results instantly from in-memory data structure

## Filter Implementation Summary

Multi-select filtering supports:
- **Customer Region**: Multiple region selection
- **Gender**: Multiple gender selection
- **Age Range**: Min/max numeric range
- **Product Category**: Multiple category selection
- **Tags**: Multiple tag selection
- **Payment Method**: Multiple payment method selection
- **Date Range**: Start and end date selection

Filters work independently and in combination using AND logic. Backend processes filters sequentially on the dataset, maintaining optimal performance even with large data volumes.

## Sorting Implementation Summary

Three sorting options implemented:
- **Date**: Newest first (descending) or oldest first (ascending)
- **Quantity**: High to low or low to high
- **Customer Name**: Alphabetical A-Z or Z-A

Sorting is performed on the backend after filtering, using JavaScript's native sort with custom comparators. Sort state is preserved when applying new filters or searches.

## Pagination Implementation Summary

Efficient pagination system with:
- Fixed page size of 10 items per page
- Previous/Next navigation controls
- Current page and total page display
- Total records count
- Disabled states for boundary pages

Backend slices the filtered and sorted dataset to return only the requested page, minimizing network transfer and improving performance.

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Dataset CSV file (`truestate_assignment_dataset.csv`)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Ensure the sales data CSV is in the root directory (../sales_data.csv)

4. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

### Running Both Together

From the root directory, you can run:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## API Endpoints

- `GET /api/sales` - Get sales data with search, filters, sorting, and pagination
- `GET /api/filters` - Get all available filter options
- `GET /health` - Health check endpoint

## Project Structure

```
TruEstate/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json
├── docs/
│   └── architecture.md     # System architecture
└── README.md              # This file
```

## Links

- **GitHub Repository**: [To be added after pushing to GitHub]
- **Live Application**: [To be added after deployment]

## Features

✅ Search by customer name or phone number  
✅ Multi-select filters for all data dimensions  
✅ Age range and date range filtering  
✅ Sorting by date, quantity, customer name  
✅ Pagination with 10 items per page  
✅ Responsive design for all devices  
✅ Clean, maintainable code architecture  
✅ Comprehensive error handling  
✅ Professional UI/UX design

## License

This project was created as part of the TruEstate SDE Intern assignment.

---

Built with ❤️ for TruEstate
