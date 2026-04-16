// types/cow.types.ts
export type HealthStatus = 'Healthy' | 'Monitoring' | 'Sick';

export interface Cow {
  id: string;
  user_id: string;
  tag: string;
  name: string;
  breed?: string | null;
  age: number;
  weight: number;
  health: HealthStatus;
  last_checkup: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface CreateCowData {
  tag: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  health?: HealthStatus;
  last_checkup?: string;
}

export interface UpdateCowData {
  tag?: string;
  name?: string;
  breed?: string | null;
  age?: number;
  weight?: number;
  health?: HealthStatus;
  last_checkup?: string;
}

export interface CowFilters {
  search?: string;
  health?: HealthStatus | 'All';
  breed?: string;
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  sortBy?: 'tag' | 'name' | 'age' | 'weight' | 'health' | 'last_checkup' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface CowState {
  cows: Cow[];
  selectedCow: Cow | null;
  isLoading: boolean;
  error: string | null;
  filters: CowFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CowContextType extends CowState {
  // CRUD operations
  fetchCows: (filters?: CowFilters, page?: number, limit?: number) => Promise<void>;
  fetchCowById: (id: string) => Promise<void>;
  addCow: (data: CreateCowData) => Promise<Cow>;
  updateCow: (id: string, data: UpdateCowData) => Promise<Cow>;
  deleteCow: (id: string) => Promise<void>;
  
  // Bulk operations
  createMultipleCows: (cows: CreateCowData[]) => Promise<Cow[]>;
  updateMultipleCows: (updates: Array<{ id: string; data: UpdateCowData }>) => Promise<Cow[]>;
  deleteMultipleCows: (ids: string[]) => Promise<void>;
  
  // Filter and selection
  setFilters: (filters: Partial<CowFilters>) => void;
  clearFilters: () => void;
  selectCow: (cow: Cow | null) => void;
  clearError: () => void;
  
  // Statistics
  getHealthDistribution: () => { healthy: number; monitoring: number; sick: number };
  getBreedDistribution: () => Record<string, number>;
  getAverageAge: () => number;
  getAverageWeight: () => number;
}