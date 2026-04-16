// services/cowApi.ts
import { api } from './api';
import { Cow, CreateCowData, UpdateCowData, CowFilters } from '../types/cow.types';

export interface CowResponse {
  cow: Cow;
}

export interface CowsResponse {
  cows: Cow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const cowApi = {
  // Get all cows with filters and pagination
  getCows: () => { //(filters?: CowFilters, page: number = 1, limit: number = 10): Promise<CowsResponse> => {
    // const params = new URLSearchParams();
    
    // if (filters?.search) params.append('search', filters.search);
    // if (filters?.health && filters.health !== 'All') params.append('health', filters.health);
    // if (filters?.breed) params.append('breed', filters.breed);
    // if (filters?.minAge) params.append('minAge', filters.minAge.toString());
    // if (filters?.maxAge) params.append('maxAge', filters.maxAge.toString());
    // if (filters?.minWeight) params.append('minWeight', filters.minWeight.toString());
    // if (filters?.maxWeight) params.append('maxWeight', filters.maxWeight.toString());
    // if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    // if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    // params.append('page', page.toString());
    // params.append('limit', limit.toString());
    
    return api.get("/v1/cows");
    // return api.get(`/v1/cows/with/${params.toString()}`);
    // return api.get<CowsResponse>(`/v1/cows/with/${params.toString()}`);
  },

  // Get single cow by ID
  getCowById: (id: string): Promise<CowResponse> => {
    return api.get<CowResponse>(`/cows/${id}`);
  },

  // Create new cow
  createCow: (data: CreateCowData): Promise<CowResponse> => {
    return api.post('/v1/cows/add', data);
    // return api.post<CowResponse>('/v1/cows/add', data);
  },

  // Update cow
  updateCow: (id: string, data: UpdateCowData): Promise<CowResponse> => {
    return api.patch<CowResponse>(`/cows/${id}`, data);
  },

  // Delete cow
  deleteCow: (id: string): Promise<void> => {
    return api.delete<void>(`/cows/${id}`);
  },

  // Bulk create cows
  createMultipleCows: (cows: CreateCowData[]): Promise<{ cows: Cow[] }> => {
    return api.post<{ cows: Cow[] }>('/cows/bulk', { cows });
  },

  // Bulk update cows
  updateMultipleCows: (updates: Array<{ id: string; data: UpdateCowData }>): Promise<{ cows: Cow[] }> => {
    return api.patch<{ cows: Cow[] }>('/cows/bulk', { updates });
  },

  // Bulk delete cows
  deleteMultipleCows: (ids: string[]): Promise<void> => {
    return api.delete<void>('/cows/bulk', { data: { ids } });
  },

  // Get cow statistics
  getStatistics: (): Promise<{
    totalCows: number;
    healthDistribution: { healthy: number; monitoring: number; sick: number };
    breedDistribution: Record<string, number>;
    averageAge: number;
    averageWeight: number;
  }> => {
    return api.get('/cows/statistics');
  },
};