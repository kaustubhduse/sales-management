import { useState, useEffect, useCallback } from 'react';
import { fetchSalesData, fetchFilterOptions } from '../services/api';
import { DEFAULT_FILTER_OPTIONS } from '../constants/filterDefaults';

export const useSalesData = () => {
  const [salesData, setSalesData] = useState([]);
  // Initialize with default options for instant rendering
  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    customerRegion: [],
    gender: [],
    ageRanges: [],
    minAge: '',
    maxAge: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    startDate: '',
    endDate: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        // Load real options in background without blocking UI
        const response = await fetchFilterOptions();
        console.log('Filter options response:', response);
        setFilterOptions(response.filters || response);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  const loadSalesData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: searchQuery,
        ...filters,
        sortBy,
        order,
        page: currentPage,
        pageSize: 10
      };

      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',');
        }
        if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await fetchSalesData(params);
      
      setSalesData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load sales data');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortBy, order, currentPage]);

  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      customerRegion: [],
      gender: [],
      ageRanges: [],
      minAge: '',
      maxAge: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      startDate: '',
      endDate: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    salesData,
    filterOptions,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    order,
    setOrder,
    currentPage,
    setCurrentPage,
    goToNextPage,
    goToPreviousPage,
    refresh: loadSalesData
  };
};
