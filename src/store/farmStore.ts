import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cow {
  id: string;
  tag: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  health: 'Healthy' | 'Monitoring' | 'Sick';
  lastCheckup: string;
}

export interface MilkRecord {
  id: string;
  date: string;
  cowId: string;
  amount: number;
  session: 'Morning' | 'Evening';
}

export interface FeedRecord {
  id: string;
  date: string;
  cowId: string;
  feedType: string;
  quantity: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  cowId: string;
  status: string;
  symptoms: string;
  treatment: string;
}

export interface Note {
  id: string;
  date: string;
  cowId: string;
  content: string;
}

export interface BreedingRecord {
  id: string;
  cowId: string;
  status: string;
  heatDate: string;
  serviceDate: string;
  expectedCalving: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  done: boolean;
}

export interface Expense {
  id: string;
  date: string;
  cowId: string;
  category: string;
  description: string;
  amount: number;
}

export interface IncomeRecord {
  id: string;
  date: string;
  litres: number;
  pricePerLitre: number;
  total: number;
  buyer: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  startDate: string;
  status: 'Active' | 'Inactive';
}

interface FarmStore {
  cows: Cow[];
  milkRecords: MilkRecord[];
  feedRecords: FeedRecord[];
  healthRecords: HealthRecord[];
  notes: Note[];
  breedingRecords: BreedingRecord[];
  alerts: Alert[];
  expenses: Expense[];
  incomeRecords: IncomeRecord[];
  workers: Worker[];
  addCow: (cow: Cow) => void;
  updateCow: (cow: Cow) => void;
  deleteCow: (id: string) => void;
  addMilkRecord: (r: MilkRecord) => void;
  deleteMilkRecord: (id: string) => void;
  addFeedRecord: (r: FeedRecord) => void;
  deleteFeedRecord: (id: string) => void;
  addHealthRecord: (r: HealthRecord) => void;
  deleteHealthRecord: (id: string) => void;
  addNote: (n: Note) => void;
  deleteNote: (id: string) => void;
  addBreedingRecord: (r: BreedingRecord) => void;
  deleteBreedingRecord: (id: string) => void;
  addAlert: (a: Alert) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  addExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;
  addIncomeRecord: (r: IncomeRecord) => void;
  deleteIncomeRecord: (id: string) => void;
  addWorker: (w: Worker) => void;
  updateWorker: (w: Worker) => void;
  deleteWorker: (id: string) => void;
}

const defaultCows: Cow[] = [
  { id: '1', tag: 'C-001', name: 'Bella', breed: 'Holstein', age: 4, weight: 580, health: 'Healthy', lastCheckup: '2026-04-08' },
  { id: '2', tag: 'C-002', name: 'Daisy', breed: 'Jersey', age: 3, weight: 420, health: 'Healthy', lastCheckup: '2026-04-07' },
  { id: '3', tag: 'C-003', name: 'Rosie', breed: 'Guernsey', age: 5, weight: 500, health: 'Monitoring', lastCheckup: '2026-04-05' },
  { id: '4', tag: 'C-004', name: 'Clover', breed: 'Holstein', age: 2, weight: 490, health: 'Healthy', lastCheckup: '2026-04-09' },
  { id: '5', tag: 'C-005', name: 'Buttercup', breed: 'Angus', age: 6, weight: 610, health: 'Sick', lastCheckup: '2026-04-10' },
];

const defaultMilkRecords: MilkRecord[] = [
  { id: 'm1', date: '2026-04-08', cowId: '1', amount: 18, session: 'Morning' },
  { id: 'm2', date: '2026-04-08', cowId: '2', amount: 12, session: 'Morning' },
  { id: 'm3', date: '2026-04-09', cowId: '1', amount: 22, session: 'Morning' },
  { id: 'm4', date: '2026-04-09', cowId: '2', amount: 15, session: 'Morning' },
  { id: 'm5', date: '2026-04-09', cowId: '3', amount: 20, session: 'Morning' },
  { id: 'm6', date: '2026-04-09', cowId: '4', amount: 10, session: 'Evening' },
  { id: 'm7', date: '2026-04-10', cowId: '1', amount: 32, session: 'Morning' },
  { id: 'm8', date: '2026-04-10', cowId: '2', amount: 24, session: 'Morning' },
  { id: 'm9', date: '2026-04-10', cowId: '3', amount: 30, session: 'Morning' },
  { id: 'm10', date: '2026-04-10', cowId: '4', amount: 12, session: 'Evening' },
];

export const useFarmStore = create<FarmStore>()(
  persist(
    (set) => ({
      cows: defaultCows,
      milkRecords: defaultMilkRecords,
      feedRecords: [],
      healthRecords: [],
      notes: [],
      breedingRecords: [],
      alerts: [],
      expenses: [],
      incomeRecords: [],
      workers: [],
      addCow: (cow) => set((s) => ({ cows: [...s.cows, cow] })),
      updateCow: (cow) => set((s) => ({ cows: s.cows.map((c) => (c.id === cow.id ? cow : c)) })),
      deleteCow: (id) => set((s) => ({ cows: s.cows.filter((c) => c.id !== id) })),
      addMilkRecord: (r) => set((s) => ({ milkRecords: [...s.milkRecords, r] })),
      deleteMilkRecord: (id) => set((s) => ({ milkRecords: s.milkRecords.filter((r) => r.id !== id) })),
      addFeedRecord: (r) => set((s) => ({ feedRecords: [...s.feedRecords, r] })),
      deleteFeedRecord: (id) => set((s) => ({ feedRecords: s.feedRecords.filter((r) => r.id !== id) })),
      addHealthRecord: (r) => set((s) => ({ healthRecords: [...s.healthRecords, r] })),
      deleteHealthRecord: (id) => set((s) => ({ healthRecords: s.healthRecords.filter((r) => r.id !== id) })),
      addNote: (n) => set((s) => ({ notes: [...s.notes, n] })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      addBreedingRecord: (r) => set((s) => ({ breedingRecords: [...s.breedingRecords, r] })),
      deleteBreedingRecord: (id) => set((s) => ({ breedingRecords: s.breedingRecords.filter((r) => r.id !== id) })),
      addAlert: (a) => set((s) => ({ alerts: [...s.alerts, a] })),
      toggleAlert: (id) => set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) })),
      deleteAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      addExpense: (e) => set((s) => ({ expenses: [...s.expenses, e] })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
      addIncomeRecord: (r) => set((s) => ({ incomeRecords: [...s.incomeRecords, r] })),
      deleteIncomeRecord: (id) => set((s) => ({ incomeRecords: s.incomeRecords.filter((r) => r.id !== id) })),
      addWorker: (w) => set((s) => ({ workers: [...s.workers, w] })),
      updateWorker: (w) => set((s) => ({ workers: s.workers.map((x) => (x.id === w.id ? w : x)) })),
      deleteWorker: (id) => set((s) => ({ workers: s.workers.filter((w) => w.id !== id) })),
    }),
    { name: 'cowtrack-storage' }
  )
);
