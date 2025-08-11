import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Facility, Review } from '../types';

// Generic hook for API calls
export const useApiCall = <T>(
  apiCall: () => Promise<any>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await apiCall();
        setData(resp || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await apiCall();
      setData(resp || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook for paginated API calls
export const usePaginatedApi = <T>(
  apiCall: (page: number, limit: number) => Promise<any>,
  initialPage = 1,
  limit = 20
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    total_pages: 0,
  });

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: API Integration - Replace with actual API call
      setData([]);
      setPagination({
        page,
        limit,
        total: 0,
        total_pages: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(initialPage);
  }, []);

  const goToPage = (page: number) => {
    fetchData(page);
  };

  const nextPage = () => {
    if (pagination.page < pagination.total_pages) {
      goToPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  };

  return {
    data,
    loading,
    error,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    refetch: () => fetchData(pagination.page),
  };
};

// Specific hooks for common API calls - these will use mock data for now
export const useFacilities = (filters?: any) => {
  const [state, setState] = useState({ data: [] as Facility[], loading: true, error: null as string | null });
  const fetch = async () => {
    const resp = await apiService.getFacilities(filters || {});
    if (resp.success) {
      // The backend returns paginated DRF style by default; our ApiResponse expects {success, data}
      const data = (resp.data as any)?.results || (resp as any).data || [];
      setState({ data, loading: false, error: null });
      return { data, success: true };
    } else {
      setState({ data: [], loading: false, error: resp.message || 'Failed to load' });
      return resp;
    }
  };
  useEffect(() => {
    setState(s => ({ ...s, loading: true }));
    fetch();
  }, [JSON.stringify(filters)]);
  return { ...state, refetch: fetch };
};

export const useFacility = (facilityId: number) => {
  const [state, setState] = useState<{ data: Facility | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const fetch = async () => {
    const resp = await apiService.getFacilityById(facilityId);
    if (!resp.success || !resp.data) {
      setState({ data: null, loading: false, error: resp.message || 'Failed to load' });
      return resp;
    }
    // Fetch courts for the facility to enrich detail view
    const courtsResp = await apiService.getCourtsByFacility(facilityId);
    const facility: any = resp.data;
    if (courtsResp.success) {
      facility.courts = courtsResp.data || [];
    }
    setState({ data: facility as Facility, loading: false, error: null });
    return { ...resp, data: facility } as any;
  };
  useEffect(() => { if (facilityId) fetch(); }, [facilityId]);
  return { ...state, refetch: fetch };
};

export const useUserBookings = (status?: string) => {
  return { data: null, loading: false, error: null, refetch: () => {} };
};

export const useOwnerFacilities = () => {
  return { data: null, loading: false, error: null, refetch: () => {} };
};

export const useOwnerBookings = () => {
  return { data: null, loading: false, error: null, refetch: () => {} };
};

export const useFacilityReviews = (facilityId: number) => {
  const [state, setState] = useState<{ data: Review[]; loading: boolean; error: string | null }>({ data: [], loading: true, error: null });
  const fetch = async () => {
    const resp = await apiService.getFacilityReviews(facilityId);
    if (resp.success) {
      setState({ data: (resp.data as any) || [], loading: false, error: null });
      return resp;
    } else {
      setState({ data: [], loading: false, error: resp.message || 'Failed to load' });
      return resp;
    }
  };
  useEffect(() => { if (facilityId) fetch(); }, [facilityId]);
  return { ...state, refetch: fetch };
};

export const useRecommendations = () => {
  return { data: null, loading: false, error: null, refetch: () => {} };
};

export const useFeaturedFacilities = () => {
  const [state, setState] = useState<{ data: Facility[]; loading: boolean; error: string | null }>({ data: [], loading: true, error: null });
  const fetch = async () => {
    const resp = await apiService.getFeaturedFacilities();
    if (resp.success) {
      setState({ data: (resp.data as any) || [], loading: false, error: null });
      return resp;
    } else {
      setState({ data: [], loading: false, error: resp.message || 'Failed to load' });
      return resp;
    }
  };
  useEffect(() => { fetch(); }, []);
  return { ...state, refetch: fetch };
};

export const useTrendingFacilities = () => {
  const [state, setState] = useState<{ data: Facility[]; loading: boolean; error: string | null }>({ data: [], loading: true, error: null });
  const fetch = async () => {
    const resp = await apiService.getTrendingFacilities();
    if (resp.success) {
      setState({ data: (resp.data as any) || [], loading: false, error: null });
      return resp;
    } else {
      setState({ data: [], loading: false, error: resp.message || 'Failed to load' });
      return resp;
    }
  };
  useEffect(() => { fetch(); }, []);
  return { ...state, refetch: fetch };
};

export const usePopularSports = () => {
  const [state, setState] = useState<{ data: { name: string; count: number }[]; loading: boolean; error: string | null }>({ data: [], loading: true, error: null });
  const fetch = async () => {
    const resp = await apiService.getPopularSports();
    if (resp.success) {
      setState({ data: (resp.data as any) || [], loading: false, error: null });
      return resp;
    } else {
      setState({ data: [], loading: false, error: resp.message || null });
      return resp;
    }
  };
  useEffect(() => { fetch(); }, []);
  return { ...state, refetch: fetch };
};