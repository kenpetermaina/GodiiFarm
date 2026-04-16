// contexts/RecordContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { milkRecordApi, feedRecordApi, healthRecordApi, recordDashboardApi } from '../services/recordApi';
import { useCow } from './CowContext';
import {
  RecordContextType,
  RecordState,
  MilkRecord,
  MilkRecordWithCow,
  CreateMilkRecordData,
  UpdateMilkRecordData,
  MilkRecordFilters,
  FeedRecord,
  FeedRecordWithCow,
  CreateFeedRecordData,
  UpdateFeedRecordData,
  FeedRecordFilters,
  HealthRecord,
  HealthRecordWithCow,
  CreateHealthRecordData,
  UpdateHealthRecordData,
  HealthRecordFilters,
  MilkStatistics,
  FeedStatistics,
  HealthStatistics,
  DateRange,
  Pagination,
} from '../types/record.types';

// Create context
const RecordContext = createContext<RecordContextType | undefined>(undefined);

interface RecordProviderProps {
  children: ReactNode;
}

// Initial state
const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const initialState: RecordState = {
  milkRecords: [],
  selectedMilkRecord: null,
  feedRecords: [],
  selectedFeedRecord: null,
  healthRecords: [],
  selectedHealthRecord: null,
  isLoading: false,
  error: null,
  milkFilters: {
    session: 'All',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  feedFilters: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  healthFilters: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  milkPagination: initialPagination,
  feedPagination: initialPagination,
  healthPagination: initialPagination,
  milkStats: null,
  feedStats: null,
  healthStats: null,
};

export const RecordProvider: React.FC<RecordProviderProps> = ({ children }) => {
  const [state, setState] = useState<RecordState>(initialState);
  const { cows } = useCow();

  // Helper to enrich records with cow data
  const enrichMilkRecords = useCallback((records: MilkRecord[]): MilkRecordWithCow[] => {
    return records.map(record => ({
      ...record,
      cow: cows.find(c => c.id === record.cow_id),
    }));
  }, [cows]);

  const enrichFeedRecords = useCallback((records: FeedRecord[]): FeedRecordWithCow[] => {
    return records.map(record => ({
      ...record,
      cow: cows.find(c => c.id === record.cow_id),
    }));
  }, [cows]);

  const enrichHealthRecords = useCallback((records: HealthRecord[]): HealthRecordWithCow[] => {
    return records.map(record => ({
      ...record,
      cow: cows.find(c => c.id === record.cow_id),
    }));
  }, [cows]);

  // ============ MILK RECORDS ============
  const fetchMilkRecords = useCallback(async (
    filters?: MilkRecordFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await milkRecordApi.getRecords(
        filters || state.milkFilters,
        page,
        limit
      );

      const enrichedRecords = enrichMilkRecords(response.records);

      setState(prev => ({
        ...prev,
        milkRecords: enrichedRecords,
        milkPagination: response.pagination,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch milk records',
      }));
      throw error;
    }
  }, [state.milkFilters, enrichMilkRecords]);

  const fetchMilkRecordById = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await milkRecordApi.getById(id);
      const enrichedRecord = enrichMilkRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        selectedMilkRecord: enrichedRecord,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch milk record',
      }));
      throw error;
    }
  }, [enrichMilkRecords]);

  const createMilkRecord = useCallback(async (data: CreateMilkRecordData): Promise<MilkRecord> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await milkRecordApi.create(data);
      const enrichedRecord = enrichMilkRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        milkRecords: [enrichedRecord, ...prev.milkRecords],
        isLoading: false,
        milkPagination: {
          ...prev.milkPagination,
          total: prev.milkPagination.total + 1,
          totalPages: Math.ceil((prev.milkPagination.total + 1) / prev.milkPagination.limit),
        },
      }));

      return response.record;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create milk record',
      }));
      throw error;
    }
  }, [enrichMilkRecords]);

  const updateMilkRecord = useCallback(async (
    id: string,
    data: UpdateMilkRecordData
  ): Promise<MilkRecord> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await milkRecordApi.update(id, data);
      const enrichedRecord = enrichMilkRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        milkRecords: prev.milkRecords.map(r => r.id === id ? enrichedRecord : r),
        selectedMilkRecord: prev.selectedMilkRecord?.id === id ? enrichedRecord : prev.selectedMilkRecord,
        isLoading: false,
      }));

      return response.record;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update milk record',
      }));
      throw error;
    }
  }, [enrichMilkRecords]);

  const deleteMilkRecord = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await milkRecordApi.delete(id);

      setState(prev => ({
        ...prev,
        milkRecords: prev.milkRecords.filter(r => r.id !== id),
        selectedMilkRecord: prev.selectedMilkRecord?.id === id ? null : prev.selectedMilkRecord,
        isLoading: false,
        milkPagination: {
          ...prev.milkPagination,
          total: prev.milkPagination.total - 1,
          totalPages: Math.ceil((prev.milkPagination.total - 1) / prev.milkPagination.limit),
        },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete milk record',
      }));
      throw error;
    }
  }, []);

  const fetchMilkStatistics = useCallback(async (filters?: DateRange): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const stats = await milkRecordApi.getStatistics(filters);

      setState(prev => ({
        ...prev,
        milkStats: stats,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch milk statistics',
      }));
      throw error;
    }
  }, []);

  // ============ FEED RECORDS ============
  const fetchFeedRecords = useCallback(async (
    filters?: FeedRecordFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await feedRecordApi.getRecords(
        filters || state.feedFilters,
        page,
        limit
      );

      const enrichedRecords = enrichFeedRecords(response.records);

      setState(prev => ({
        ...prev,
        feedRecords: enrichedRecords,
        feedPagination: response.pagination,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch feed records',
      }));
      throw error;
    }
  }, [state.feedFilters, enrichFeedRecords]);

  const fetchFeedRecordById = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await feedRecordApi.getById(id);
      const enrichedRecord = enrichFeedRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        selectedFeedRecord: enrichedRecord,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch feed record',
      }));
      throw error;
    }
  }, [enrichFeedRecords]);

  const createFeedRecord = useCallback(async (data: CreateFeedRecordData): Promise<FeedRecord> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await feedRecordApi.create(data);
      const enrichedRecord = enrichFeedRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        feedRecords: [enrichedRecord, ...prev.feedRecords],
        isLoading: false,
        feedPagination: {
          ...prev.feedPagination,
          total: prev.feedPagination.total + 1,
          totalPages: Math.ceil((prev.feedPagination.total + 1) / prev.feedPagination.limit),
        },
      }));

      return response.record;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create feed record',
      }));
      throw error;
    }
  }, [enrichFeedRecords]);

  const updateFeedRecord = useCallback(async (
    id: string,
    data: UpdateFeedRecordData
  ): Promise<FeedRecord> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await feedRecordApi.update(id, data);
      const enrichedRecord = enrichFeedRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        feedRecords: prev.feedRecords.map(r => r.id === id ? enrichedRecord : r),
        selectedFeedRecord: prev.selectedFeedRecord?.id === id ? enrichedRecord : prev.selectedFeedRecord,
        isLoading: false,
      }));

      return response.record;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update feed record',
      }));
      throw error;
    }
  }, [enrichFeedRecords]);

  const deleteFeedRecord = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await feedRecordApi.delete(id);

      setState(prev => ({
        ...prev,
        feedRecords: prev.feedRecords.filter(r => r.id !== id),
        selectedFeedRecord: prev.selectedFeedRecord?.id === id ? null : prev.selectedFeedRecord,
        isLoading: false,
        feedPagination: {
          ...prev.feedPagination,
          total: prev.feedPagination.total - 1,
          totalPages: Math.ceil((prev.feedPagination.total - 1) / prev.feedPagination.limit),
        },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete feed record',
      }));
      throw error;
    }
  }, []);

  const fetchFeedStatistics = useCallback(async (filters?: DateRange): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const stats = await feedRecordApi.getStatistics(filters);

      setState(prev => ({
        ...prev,
        feedStats: stats,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch feed statistics',
      }));
      throw error;
    }
  }, []);

  // ============ HEALTH RECORDS ============
  const fetchHealthRecords = useCallback(async (
    filters?: HealthRecordFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await healthRecordApi.getRecords(
        filters || state.healthFilters,
        page,
        limit
      );

      const enrichedRecords = enrichHealthRecords(response.records);

      setState(prev => ({
        ...prev,
        healthRecords: enrichedRecords,
        healthPagination: response.pagination,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch health records',
      }));
      throw error;
    }
  }, [state.healthFilters, enrichHealthRecords]);

  const fetchHealthRecordById = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await healthRecordApi.getById(id);
      const enrichedRecord = enrichHealthRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        selectedHealthRecord: enrichedRecord,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch health record',
      }));
      throw error;
    }
  }, [enrichHealthRecords]);

  const createHealthRecord = useCallback(async (data: CreateHealthRecordData): Promise<HealthRecord> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await healthRecordApi.create(data);
      const enrichedRecord = enrichHealthRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        healthRecords: [enrichedRecord, ...prev.healthRecords],
        isLoading: false,
        healthPagination: {
          ...prev.healthPagination,
          total: prev.healthPagination.total + 1,
          totalPages: Math.ceil((prev.healthPagination.total + 1) / prev.healthPagination.limit),
        },
      }));

      return response.record;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create health record',
      }));
      throw error;
    }
  }, [enrichHealthRecords]);

  const updateHealthRecord = useCallback(async (
    id: string,
    data: UpdateHealthRecordData
  ): Promise<HealthRecord> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await healthRecordApi.update(id, data);
      const enrichedRecord = enrichHealthRecords([response.record])[0];

      setState(prev => ({
        ...prev,
        healthRecords: prev.healthRecords.map(r => r.id === id ? enrichedRecord : r),
        selectedHealthRecord: prev.selectedHealthRecord?.id === id ? enrichedRecord : prev.selectedHealthRecord,
        isLoading: false,
      }));

      return response.record;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update health record',
      }));
      throw error;
    }
  }, [enrichHealthRecords]);

  const deleteHealthRecord = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await healthRecordApi.delete(id);

      setState(prev => ({
        ...prev,
        healthRecords: prev.healthRecords.filter(r => r.id !== id),
        selectedHealthRecord: prev.selectedHealthRecord?.id === id ? null : prev.selectedHealthRecord,
        isLoading: false,
        healthPagination: {
          ...prev.healthPagination,
          total: prev.healthPagination.total - 1,
          totalPages: Math.ceil((prev.healthPagination.total - 1) / prev.healthPagination.limit),
        },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete health record',
      }));
      throw error;
    }
  }, []);

  const fetchHealthStatistics = useCallback(async (filters?: DateRange): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const stats = await healthRecordApi.getStatistics(filters);

      setState(prev => ({
        ...prev,
        healthStats: stats,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch health statistics',
      }));
      throw error;
    }
  }, []);

  // ============ BULK OPERATIONS ============
  const createMultipleMilkRecords = useCallback(async (
    records: CreateMilkRecordData[]
  ): Promise<MilkRecord[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await milkRecordApi.createMultiple(records);
      const enrichedRecords = enrichMilkRecords(response.records);

      setState(prev => ({
        ...prev,
        milkRecords: [...enrichedRecords, ...prev.milkRecords],
        isLoading: false,
        milkPagination: {
          ...prev.milkPagination,
          total: prev.milkPagination.total + response.records.length,
          totalPages: Math.ceil(
            (prev.milkPagination.total + response.records.length) / prev.milkPagination.limit
          ),
        },
      }));

      return response.records;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create multiple milk records',
      }));
      throw error;
    }
  }, [enrichMilkRecords]);

  const createMultipleFeedRecords = useCallback(async (
    records: CreateFeedRecordData[]
  ): Promise<FeedRecord[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await feedRecordApi.createMultiple(records);
      const enrichedRecords = enrichFeedRecords(response.records);

      setState(prev => ({
        ...prev,
        feedRecords: [...enrichedRecords, ...prev.feedRecords],
        isLoading: false,
        feedPagination: {
          ...prev.feedPagination,
          total: prev.feedPagination.total + response.records.length,
          totalPages: Math.ceil(
            (prev.feedPagination.total + response.records.length) / prev.feedPagination.limit
          ),
        },
      }));

      return response.records;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create multiple feed records',
      }));
      throw error;
    }
  }, [enrichFeedRecords]);

  const createMultipleHealthRecords = useCallback(async (
    records: CreateHealthRecordData[]
  ): Promise<HealthRecord[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await healthRecordApi.createMultiple(records);
      const enrichedRecords = enrichHealthRecords(response.records);

      setState(prev => ({
        ...prev,
        healthRecords: [...enrichedRecords, ...prev.healthRecords],
        isLoading: false,
        healthPagination: {
          ...prev.healthPagination,
          total: prev.healthPagination.total + response.records.length,
          totalPages: Math.ceil(
            (prev.healthPagination.total + response.records.length) / prev.healthPagination.limit
          ),
        },
      }));

      return response.records;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create multiple health records',
      }));
      throw error;
    }
  }, [enrichHealthRecords]);

  // ============ FILTER MANAGEMENT ============
  const setMilkFilters = useCallback((filters: Partial<MilkRecordFilters>): void => {
    setState(prev => ({
      ...prev,
      milkFilters: { ...prev.milkFilters, ...filters },
    }));
  }, []);

  const setFeedFilters = useCallback((filters: Partial<FeedRecordFilters>): void => {
    setState(prev => ({
      ...prev,
      feedFilters: { ...prev.feedFilters, ...filters },
    }));
  }, []);

  const setHealthFilters = useCallback((filters: Partial<HealthRecordFilters>): void => {
    setState(prev => ({
      ...prev,
      healthFilters: { ...prev.healthFilters, ...filters },
    }));
  }, []);

  const clearAllFilters = useCallback((): void => {
    setState(prev => ({
      ...prev,
      milkFilters: initialState.milkFilters,
      feedFilters: initialState.feedFilters,
      healthFilters: initialState.healthFilters,
    }));
  }, []);

  // ============ SELECTION MANAGEMENT ============
  const selectMilkRecord = useCallback((record: MilkRecordWithCow | null): void => {
    setState(prev => ({ ...prev, selectedMilkRecord: record }));
  }, []);

  const selectFeedRecord = useCallback((record: FeedRecordWithCow | null): void => {
    setState(prev => ({ ...prev, selectedFeedRecord: record }));
  }, []);

  const selectHealthRecord = useCallback((record: HealthRecordWithCow | null): void => {
    setState(prev => ({ ...prev, selectedHealthRecord: record }));
  }, []);

  // ============ ERROR MANAGEMENT ============
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ============ DASHBOARD DATA ============
  const fetchDashboardData = useCallback(async (dateRange?: DateRange) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const data = await recordDashboardApi.getDashboardData(dateRange);

      setState(prev => ({
        ...prev,
        milkStats: data.milk,
        feedStats: data.feed,
        healthStats: data.health,
        isLoading: false,
      }));

      return data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch dashboard data',
      }));
      throw error;
    }
  }, []);

  const value: RecordContextType = {
    ...state,
    fetchMilkRecords,
    fetchMilkRecordById,
    createMilkRecord,
    updateMilkRecord,
    deleteMilkRecord,
    fetchMilkStatistics,
    fetchFeedRecords,
    fetchFeedRecordById,
    createFeedRecord,
    updateFeedRecord,
    deleteFeedRecord,
    fetchFeedStatistics,
    fetchHealthRecords,
    fetchHealthRecordById,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    fetchHealthStatistics,
    createMultipleMilkRecords,
    createMultipleFeedRecords,
    createMultipleHealthRecords,
    setMilkFilters,
    setFeedFilters,
    setHealthFilters,
    clearAllFilters,
    selectMilkRecord,
    selectFeedRecord,
    selectHealthRecord,
    clearError,
    fetchDashboardData,
  };

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
};

// Custom hook
export const useRecord = (): RecordContextType => {
  const context = useContext(RecordContext);
  
  if (context === undefined) {
    throw new Error('useRecord must be used within a RecordProvider');
  }
  
  return context;
};