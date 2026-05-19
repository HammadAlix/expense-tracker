import db from '@/lib/db';
import { CATEGORIES, type Category, type Expense } from '@/types/expense';
import ExpenseTracker from '@/components/ExpenseTracker';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let expenses: Expense[];
  if (category && CATEGORIES.includes(category as Category)) {
    expenses = db
      .prepare('SELECT * FROM expenses WHERE category = ? ORDER BY date DESC')
      .all(category) as Expense[];
  } else {
    expenses = db
      .prepare('SELECT * FROM expenses ORDER BY date DESC')
      .all() as Expense[];
  }

  return (
    <ExpenseTracker
      initialExpenses={expenses}
      initialCategory={category ?? ''}
    />
  );
}
