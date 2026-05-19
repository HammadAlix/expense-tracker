export type Category = 'food' | 'transport' | 'utilities' | 'other';

export const CATEGORIES: Category[] = ['food', 'transport', 'utilities', 'other'];

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  date: string;
  created_at: string;
}