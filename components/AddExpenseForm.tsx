'use client';

import { useState } from 'react';
import { CATEGORIES, type Category, type Expense } from '@/types/expense';
import styles from './AddExpenseForm.module.css';

type Props = {
  onAdd: (expense: Expense) => void;
};

export default function AddExpenseForm(props: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault();
        setError('');

        if (title === '') {
          setError('Title is required');
          return;
        }

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
          setError('Amount must be a positive number');
          return;
        }

        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, amount: amountNum, category, date }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error);
          return;
        }

        const newExpense: Expense = await res.json();
        props.onAdd(newExpense);

        setTitle('');
        setAmount('');
      }}
    >
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" placeholder="Amount" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit">Add Expense</button>
    </form>
  );
}
