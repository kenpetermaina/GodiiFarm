// services/recordApi.ts
import { api } from './api';
import {
  MilkRecord,
  CreateMilkRecordData,
  UpdateMilkRecordData,
  MilkRecordFilters,
  MilkStatistics,
  FeedRecord,
  CreateFeedRecordData,
  UpdateFeedRecordData,
  FeedRecordFilters,
  FeedStatistics,
  HealthRecord,
  CreateHealthRecordData,
  UpdateHealthRecordData,
  HealthRecordFilters,
  HealthStatistics,
  DateRange,
  Pagination,
} from '../types/record.types';

// Response Types
interface MilkRecordsResponse {
  records: MilkRecord[];
  pagination: Pagination;
}

interface FeedRecordsResponse {
  records: FeedRecord[];
  pagination: Pagination;
}

interface HealthRecordsResponse {
  records: HealthRecord[];
  pagination: Pagination;
}

// Milk Records API
export const milkRecordApi = {
  getRecords: (filters?: MilkRecordFilters, page: number = 1, limit: number = 10): Promise<MilkRecordsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.cow_id) params.append('cow_id', filters.cow_id);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.session && filters.session !== 'All') params.append('session', filters.session);
    if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
    if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return api.get<MilkRecordsResponse>(`/milk-records?${params.toString()}`);
  },

  getById: (id: string): Promise<{ record: MilkRecord }> => {
    return api.get<{ record: MilkRecord }>(`/milk-records/${id}`);
  },

  create: (data: CreateMilkRecordData): Promise<{ record: MilkRecord }> => {
    return api.post<{ record: MilkRecord }>('/milk-records', data);
  },

  update: (id: string, data: UpdateMilkRecordData): Promise<{ record: MilkRecord }> => {
    return api.patch<{ record: MilkRecord }>(`/milk-records/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete<void>(`/milk-records/${id}`);
  },

  createMultiple: (records: CreateMilkRecordData[]): Promise<{ records: MilkRecord[] }> => {
    return api.post<{ records: MilkRecord[] }>('/milk-records/bulk', { records });
  },

  getStatistics: (filters?: DateRange): Promise<MilkStatistics> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    return api.get<MilkStatistics>(`/milk-records/statistics?${params.toString()}`);
  },
};

// Feed Records API
export const feedRecordApi = {
  getRecords: (filters?: FeedRecordFilters, page: number = 1, limit: number = 10): Promise<FeedRecordsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.cow_id) params.append('cow_id', filters.cow_id);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.feed_type) params.append('feed_type', filters.feed_type);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return api.get<FeedRecordsResponse>(`/feed-records?${params.toString()}`);
  },

  getById: (id: string): Promise<{ record: FeedRecord }> => {
    return api.get<{ record: FeedRecord }>(`/feed-records/${id}`);
  },

  create: (data: CreateFeedRecordData): Promise<{ record: FeedRecord }> => {
    return api.post<{ record: FeedRecord }>('/feed-records', data);
  },

  update: (id: string, data: UpdateFeedRecordData): Promise<{ record: FeedRecord }> => {
    return api.patch<{ record: FeedRecord }>(`/feed-records/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete<void>(`/feed-records/${id}`);
  },

  createMultiple: (records: CreateFeedRecordData[]): Promise<{ records: FeedRecord[] }> => {
    return api.post<{ records: FeedRecord[] }>('/feed-records/bulk', { records });
  },

  getStatistics: (filters?: DateRange): Promise<FeedStatistics> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    return api.get<FeedStatistics>(`/feed-records/statistics?${params.toString()}`);
  },
};

// Health Records API
export const healthRecordApi = {
  getRecords: (filters?: HealthRecordFilters, page: number = 1, limit: number = 10): Promise<HealthRecordsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.cow_id) params.append('cow_id', filters.cow_id);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return api.get<HealthRecordsResponse>(`/health-records?${params.toString()}`);
  },

  getById: (id: string): Promise<{ record: HealthRecord }> => {
    return api.get<{ record: HealthRecord }>(`/health-records/${id}`);
  },

  create: (data: CreateHealthRecordData): Promise<{ record: HealthRecord }> => {
    return api.post<{ record: HealthRecord }>('/health-records', data);
  },

  update: (id: string, data: UpdateHealthRecordData): Promise<{ record: HealthRecord }> => {
    return api.patch<{ record: HealthRecord }>(`/health-records/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete<void>(`/health-records/${id}`);
  },

  createMultiple: (records: CreateHealthRecordData[]): Promise<{ records: HealthRecord[] }> => {
    return api.post<{ records: HealthRecord[] }>('/health-records/bulk', { records });
  },

  getStatistics: (filters?: DateRange): Promise<HealthStatistics> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    return api.get<HealthStatistics>(`/health-records/statistics?${params.toString()}`);
  },
};

// Combined Dashboard API
export const recordDashboardApi = {
  getDashboardData: (dateRange?: DateRange): Promise<{
    milk: MilkStatistics;
    feed: FeedStatistics;
    health: HealthStatistics;
  }> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    return api.get(`/records/dashboard?${params.toString()}`);
  },
};