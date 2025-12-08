import { useQuery } from '@tanstack/react-query';
import { fetchSalesData, fetchFilterOptions } from '../services/api';


export const useSalesData = (params) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => fetchSalesData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
};


export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: fetchFilterOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};
