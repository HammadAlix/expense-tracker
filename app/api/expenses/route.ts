import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CATEGORIES, type Category, type Expense } from '@/types/expense';

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category');

  let rows: Expense[];
  if (category && CATEGORIES.includes(category as Category)) {
    rows = db
      .prepare('SELECT * FROM expenses WHERE category = ? ORDER BY date DESC')
      .all(category) as Expense[];
  } else {
    rows = db
      .prepare('SELECT * FROM expenses ORDER BY date DESC')
      .all() as Expense[];
  }

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Expense>;

  const title = body.title;
  const amount = body.amount;
  const category = body.category;
  const date = body.date;

  // validation
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
  }
  if (!category || !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  // insert into db
  const result = db
    .prepare('INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)')
    .run(title, amount, category, date);

  // get the new row to return
  const newRow = db
    .prepare('SELECT * FROM expenses WHERE id = ?')
    .get(result.lastInsertRowid) as Expense;

  return NextResponse.json(newRow, { status: 201 });
}
