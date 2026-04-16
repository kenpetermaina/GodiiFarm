// contexts/CowContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
    useEffect,
} from 'react';
import { cowApi } from '../services/cowApi';
import {
    CowContextType,
    CowState,
    Cow,
    CreateCowData,
    UpdateCowData,
    CowFilters,
} from '../types/cow.types';

// Create the context with undefined initial value
const CowContext = createContext<CowContextType | undefined>(undefined);

// Props for the provider component
interface CowProviderProps {
    children: ReactNode;
}

// Initial state
const initialState: CowState = {
    cows: [],
    selectedCow: null,
    isLoading: false,
    error: null,
    filters: {
        health: 'All',
        sortBy: 'created_at',
        sortOrder: 'desc',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
};

export const CowProvider: React.FC<CowProviderProps> = ({ children }) => {
    const [state, setState] = useState<CowState>(initialState);
    const [cows, setCows] = useState([]);

    const getCow = async () => {
        try {

        } catch (error) {
            console.log("Error: ",);
        }
    }

    // Fetch all cows with filters and pagination
    const fetchCows = useCallback(async (
        filters?: CowFilters,
        page: number = 1,
        limit: number = 10
    ): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await cowApi.getCows();
            // console.log("response: ", response);
            setState(prev => ({
                ...prev,
                cows: response.data,
                pagination: response.pagination,
                isLoading: false,
            }));
            setCows(response.data);
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to fetch cows',
            }));
            throw error;
        }
    }, [state.filters]);

    useEffect(() => {
        fetchCows();
        // console.log("Cows: ", cows);
    }, [cows]);

    // Fetch single cow by ID
    const fetchCowById = useCallback(async (id: string): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await cowApi.getCowById(id);

            setState(prev => ({
                ...prev,
                selectedCow: response.cow,
                isLoading: false,
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to fetch cow details',
            }));
            throw error;
        }
    }, []);

    // Create new cow
    const addCow = useCallback(async (data: CreateCowData): Promise<Cow> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await cowApi.createCow(data);
            console.log("Add Cow res: ", response);
            setState(prev => ({
                ...prev,
                cows: [response.cow, ...prev.cows],
                isLoading: false,
                pagination: {
                    ...prev.pagination,
                    total: prev.pagination.total + 1,
                    totalPages: Math.ceil((prev.pagination.total + 1) / prev.pagination.limit),
                },
            }));

            return response.cow;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to create cow',
            }));
            throw error;
        }
    }, []);

    // Update cow
    const updateCow = useCallback(async (id: string, data: UpdateCowData): Promise<Cow> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await cowApi.updateCow(id, data);

            setState(prev => ({
                ...prev,
                cows: prev.cows.map(cow => cow.id === id ? response.cow : cow),
                selectedCow: prev.selectedCow?.id === id ? response.cow : prev.selectedCow,
                isLoading: false,
            }));

            return response.cow;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to update cow',
            }));
            throw error;
        }
    }, []);

    // Delete cow
    const deleteCow = useCallback(async (id: string): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            await cowApi.deleteCow(id);

            setState(prev => ({
                ...prev,
                cows: prev.cows.filter(cow => cow.id !== id),
                selectedCow: prev.selectedCow?.id === id ? null : prev.selectedCow,
                isLoading: false,
                pagination: {
                    ...prev.pagination,
                    total: prev.pagination.total - 1,
                    totalPages: Math.ceil((prev.pagination.total - 1) / prev.pagination.limit),
                },
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to delete cow',
            }));
            throw error;
        }
    }, []);

    // Bulk create cows
    const createMultipleCows = useCallback(async (cows: CreateCowData[]): Promise<Cow[]> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await cowApi.createMultipleCows(cows);

            setState(prev => ({
                ...prev,
                cows: [...response.cows, ...prev.cows],
                isLoading: false,
                pagination: {
                    ...prev.pagination,
                    total: prev.pagination.total + response.cows.length,
                    totalPages: Math.ceil((prev.pagination.total + response.cows.length) / prev.pagination.limit),
                },
            }));

            return response.cows;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to create multiple cows',
            }));
            throw error;
        }
    }, []);

    // Bulk update cows
    const updateMultipleCows = useCallback(async (
        updates: Array<{ id: string; data: UpdateCowData }>
    ): Promise<Cow[]> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await cowApi.updateMultipleCows(updates);

            setState(prev => {
                const updatedCows = [...prev.cows];
                response.cows.forEach(updatedCow => {
                    const index = updatedCows.findIndex(c => c.id === updatedCow.id);
                    if (index !== -1) {
                        updatedCows[index] = updatedCow;
                    }
                });

                return {
                    ...prev,
                    cows: updatedCows,
                    isLoading: false,
                };
            });

            return response.cows;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to update multiple cows',
            }));
            throw error;
        }
    }, []);

    // Bulk delete cows
    const deleteMultipleCows = useCallback(async (ids: string[]): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            await cowApi.deleteMultipleCows(ids);

            setState(prev => ({
                ...prev,
                cows: prev.cows.filter(cow => !ids.includes(cow.id)),
                selectedCow: prev.selectedCow && ids.includes(prev.selectedCow.id) ? null : prev.selectedCow,
                isLoading: false,
                pagination: {
                    ...prev.pagination,
                    total: prev.pagination.total - ids.length,
                    totalPages: Math.ceil((prev.pagination.total - ids.length) / prev.pagination.limit),
                },
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to delete multiple cows',
            }));
            throw error;
        }
    }, []);

    // Set filters
    const setFilters = useCallback((filters: Partial<CowFilters>): void => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, ...filters },
        }));
    }, []);

    // Clear filters
    const clearFilters = useCallback((): void => {
        setState(prev => ({
            ...prev,
            filters: initialState.filters,
        }));
    }, []);

    // Select cow
    const selectCow = useCallback((cow: Cow | null): void => {
        setState(prev => ({ ...prev, selectedCow: cow }));
    }, []);

    // Clear error
    const clearError = useCallback((): void => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Get health distribution
    const getHealthDistribution = useCallback(() => {
        return state.cows.reduce(
            (acc, cow) => {
                const health = cow.health.toLowerCase() as keyof typeof acc;
                acc[health]++;
                return acc;
            },
            { healthy: 0, monitoring: 0, sick: 0 }
        );
    }, [state.cows]);

    // Get breed distribution
    const getBreedDistribution = useCallback(() => {
        return state.cows.reduce((acc, cow) => {
            if (cow.breed) {
                acc[cow.breed] = (acc[cow.breed] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [state.cows]);

    // Get average age
    const getAverageAge = useCallback(() => {
        if (state.cows.length === 0) return 0;
        const total = state.cows.reduce((sum, cow) => sum + cow.age, 0);
        return total / state.cows.length;
    }, [state.cows]);

    // Get average weight
    const getAverageWeight = useCallback(() => {
        if (state.cows.length === 0) return 0;
        const total = state.cows.reduce((sum, cow) => sum + cow.weight, 0);
        return total / state.cows.length;
    }, [state.cows]);

    const value: CowContextType = {
        ...state,
        cows,
        fetchCows,
        fetchCowById,
        addCow,
        updateCow,
        deleteCow,
        createMultipleCows,
        updateMultipleCows,
        deleteMultipleCows,
        setFilters,
        clearFilters,
        selectCow,
        clearError,
        getHealthDistribution,
        getBreedDistribution,
        getAverageAge,
        getAverageWeight,
    };

    return <CowContext.Provider value={value}>{children}</CowContext.Provider>;
};

// Custom hook to use the cow context
export const useCow = (): CowContextType => {
    const context = useContext(CowContext);

    if (context === undefined) {
        throw new Error('useCow must be used within a CowProvider');
    }

    return context;
};