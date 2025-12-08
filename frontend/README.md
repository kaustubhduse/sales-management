# TruEstate Frontend

Modern React frontend for the Retail Sales Management System.

## Tech Stack

- React 18
- Vite
- Axios
- Custom Hooks

## Features

- **Search**: Real-time search by customer name or phone number
- **Multi-Select Filters**: Region, gender, category, payment method, and more
- **Sorting**: Sort by date, quantity, or customer name
- **Pagination**: Navigate through results with 10 items per page
- **Responsive Design**: Works on desktop, tablet, and mobile

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run at http://localhost:5173

## Component Structure

- `App.jsx` - Main application component
- `components/SearchBar.jsx` - Search input with debouncing
- `components/FilterPanel.jsx` - Multi-select filter panel
- `components/SortingDropdown.jsx` - Sort options dropdown
- `components/TransactionTable.jsx` - Sales data table
- `components/Pagination.jsx` - Pagination controls
- `hooks/useSalesData.js` - Custom hook for state management
- `services/api.js` - API communication layer

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.
