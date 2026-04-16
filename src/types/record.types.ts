// types/record.types.ts
export type MilkSession = 'Morning' | 'Lunch' | 'Evening';

// Milk Record Types
export interface MilkRecord {
  id: string;
  user_id: string;
  cow_id: string;
  date: string;
  amount: number;
  session: MilkSession;
  created_at: string;
  updated_at: string;
}

export interface MilkRecordWithCow extends MilkRecord {
  cow?: {
    id: string;
    tag: string;
    name: string;
  };
}

export interface CreateMilkRecordData {
  cow_id: string;
  date: string;
  amount: number;
  session: MilkSession;
}

export interface UpdateMilkRecordData {
  date?: string;
  amount?: number;
  session?: MilkSession;
}

// Feed Record Types
export interface FeedRecord {
  id: string;
  user_id: string;
  cow_id: string;
  date: string;
  feed_type: string;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface FeedRecordWithCow extends FeedRecord {
  cow?: {
    id: string;
    tag: string;
    name: string;
  };
}

export interface CreateFeedRecordData {
  cow_id: string;
  date: string;
  feed_type: string;
  quantity: string;
}

export interface UpdateFeedRecordData {
  date?: string;
  feed_type?: string;
  quantity?: string;
}

// Health Record Types
export interface HealthRecord {
  id: string;
  user_id: string;
  cow_id: string;
  date: string;
  status: string;
  symptoms?: string | null;
  treatment?: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthRecordWithCow extends HealthRecord {
  cow?: {
    id: string;
    tag: string;
    name: string;
  };
}

export interface CreateHealthRecordData {
  cow_id: string;
  date: string;
  status: string;
  symptoms?: string;
  treatment?: string;
}

export interface UpdateHealthRecordData {
  date?: string;
  status?: string;
  symptoms?: string | null;
  treatment?: string | null;
}

// Common Filter Types
export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface RecordFilters extends DateRange {
  cow_id?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MilkRecordFilters extends RecordFilters {
  session?: MilkSession | 'All';
  minAmount?: number;
  maxAmount?: number;
}

export interface FeedRecordFilters extends RecordFilters {
  feed_type?: string;
}

export interface HealthRecordFilters extends RecordFilters {
  status?: string;
}

// Statistics Types
export interface MilkStatistics {
  totalRecords: number;
  totalAmount: number;
  averageAmount: number;
  dailyAverage: number;
  bySession: {
    Morning: { count: number; total: number; average: number };
    Lunch: { count: number; total: number; average: number };
    Evening: { count: number; total: number; average: number };
  };
  byCow: Array<{
    cow_id: string;
    cow_tag: string;
    cow_name: string;
    totalAmount: number;
    averageAmount: number;
    recordCount: number;
  }>;
  byDate: Array<{
    date: string;
    totalAmount: number;
    recordCount: number;
  }>;
}

export interface FeedStatistics {
  totalRecords: number;
  byFeedType: Record<string, number>;
  byCow: Array<{
    cow_id: string;
    cow_tag: string;
    cow_name: string;
    feedTypes: Record<string, number>;
    recordCount: number;
  }>;
}

export interface HealthStatistics {
  totalRecords: number;
  byStatus: Record<string, number>;
  byCow: Array<{
    cow_id: string;
    cow_tag: string;
    cow_name: string;
    statusCounts: Record<string, number>;
    recordCount: number;
    latestStatus: string;
    latestDate: string;
  }>;
}

// Combined State Types
export interface RecordState {
  // Milk records
  milkRecords: MilkRecordWithCow[];
  selectedMilkRecord: MilkRecordWithCow | null;
  
  // Feed records
  feedRecords: FeedRecordWithCow[];
  selectedFeedRecord: FeedRecordWithCow | null;
  
  // Health records
  healthRecords: HealthRecordWithCow[];
  selectedHealthRecord: HealthRecordWithCow | null;
  
  // Common state
  isLoading: boolean;
  error: string | null;
  
  // Filters
  milkFilters: MilkRecordFilters;
  feedFilters: FeedRecordFilters;
  healthFilters: HealthRecordFilters;
  
  // Pagination
  milkPagination: Pagination;
  feedPagination: Pagination;
  healthPagination: Pagination;
  
  // Statistics
  milkStats: MilkStatistics | null;
  feedStats: FeedStatistics | null;
  healthStats: HealthStatistics | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Main Context Type
export interface RecordContextType extends RecordState {
  // Milk Records
  fetchMilkRecords: (filters?: MilkRecordFilters, page?: number, limit?: number) => Promise<void>;
  fetchMilkRecordById: (id: string) => Promise<void>;
  createMilkRecord: (data: CreateMilkRecordData) => Promise<MilkRecord>;
  updateMilkRecord: (id: string, data: UpdateMilkRecordData) => Promise<MilkRecord>;
  deleteMilkRecord: (id: string) => Promise<void>;
  fetchMilkStatistics: (filters?: DateRange) => Promise<void>;
  
  // Feed Records
  fetchFeedRecords: (filters?: FeedRecordFilters, page?: number, limit?: number) => Promise<void>;
  fetchFeedRecordById: (id: string) => Promise<void>;
  createFeedRecord: (data: CreateFeedRecordData) => Promise<FeedRecord>;
  updateFeedRecord: (id: string, data: UpdateFeedRecordData) => Promise<FeedRecord>;
  deleteFeedRecord: (id: string) => Promise<void>;
  fetchFeedStatistics: (filters?: DateRange) => Promise<void>;
  
  // Health Records
  fetchHealthRecords: (filters?: HealthRecordFilters, page?: number, limit?: number) => Promise<void>;
  fetchHealthRecordById: (id: string) => Promise<void>;
  createHealthRecord: (data: CreateHealthRecordData) => Promise<HealthRecord>;
  updateHealthRecord: (id: string, data: UpdateHealthRecordData) => Promise<HealthRecord>;
  deleteHealthRecord: (id: string) => Promise<void>;
  fetchHealthStatistics: (filters?: DateRange) => Promise<void>;
  
  // Bulk Operations
  createMultipleMilkRecords: (records: CreateMilkRecordData[]) => Promise<MilkRecord[]>;
  createMultipleFeedRecords: (records: CreateFeedRecordData[]) => Promise<FeedRecord[]>;
  createMultipleHealthRecords: (records: CreateHealthRecordData[]) => Promise<HealthRecord[]>;
  
  // Filter Management
  setMilkFilters: (filters: Partial<MilkRecordFilters>) => void;
  setFeedFilters: (filters: Partial<FeedRecordFilters>) => void;
  setHealthFilters: (filters: Partial<HealthRecordFilters>) => void;
  clearAllFilters: () => void;
  
  // Selection Management
  selectMilkRecord: (record: MilkRecordWithCow | null) => void;
  selectFeedRecord: (record: FeedRecordWithCow | null) => void;
  selectHealthRecord: (record: HealthRecordWithCow | null) => void;
  
  // Error Management
  clearError: () => void;
  
  // Dashboard Data
  fetchDashboardData: (dateRange?: DateRange) => Promise<{
    milk: MilkStatistics;
    feed: FeedStatistics;
    health: HealthStatistics;
  }>;
}