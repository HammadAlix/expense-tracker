'use client';

import { useState } from 'react';
import { CATEGORIES, type Expense } from '@/types/expense';
import AddExpenseForm from './AddExpenseForm';
import styles from './ExpenseTracker.module.css';

type Props = {
  initialExpenses: Expense[];
  initialCategory: string;
};

export default function ExpenseTracker(props: Props) {
  const [expenses, setExpenses] = useState<Expense[]>(props.initialExpenses);
  const [category, setCategory] = useState(props.initialCategory);

  // total
  let total = 0;
  for (const e of expenses) {
    total += e.amount;
  }

  function addExpense(newExpense: Expense) {
    if (category === '' || newExpense.category === category) {
      setExpenses([newExpense, ...expenses]);
    }
  }

  async function deleteExpense(id: number) {
    // remove from list right away (optimistic)
    const old = expenses;
    const updated: Expense[] = [];
    for (const e of expenses) {
      if (e.id !== id) updated.push(e);
    }
    setExpenses(updated);

    const res = await fetch('/api/expenses/' + id, { method: 'DELETE' });
    if (!res.ok) {
      setExpenses(old);
      alert('Failed to delete');
    }
  }

  async function changeCategory(value: string) {
    setCategory(value);

    let url = '/api/expenses';
    if (value !== '') url = '/api/expenses?category=' + value;

    const res = await fetch(url);
    const data: Expense[] = await res.json();
    setExpenses(data);
  }

  return (
    <main className={styles.container}>
      <h1>Expense Tracker</h1>
      <p className={styles.total}>Total: ${total.toFixed(2)}</p>

      <AddExpenseForm onAdd={addExpense} />

      <div className={styles.filter}>
        <label>Filter: </label>
        <select value={category} onChange={(e) => changeCategory(e.target.value)}>
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {expenses.length === 0 ? (
        <p className={styles.empty}>No expenses yet Add one above</p>
      ) : (
        expenses.map((e) => (
          <div key={e.id} className={styles.expense}>
            <div>
              <strong>{e.title}</strong>
              <br />
              <small>{e.category} · {e.date}</small>
            </div>
            <div>
              <span>${e.amount.toFixed(2)}</span>
              <button className={styles.deleteBtn} onClick={() => deleteExpense(e.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
