# Expense Tracker

A small full-stack expense tracker built with Next.js (App Router), TypeScript, and SQLite via `better-sqlite3` (raw SQL, no ORM).

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database file `expenses.db` is created automatically in the project root on first run.

## Features

- Server Component fetches the initial list of expenses on page load
- Add expense via form — no full page reload
- Filter list by category (food / transport / utilities / other)
- Delete with optimistic UI (row disappears before the API responds)
- Total spend shown at the top, calculated from the fetched data
- Empty state when there are no expenses

## API

- `GET /api/expenses` — list all expenses, sorted by date desc. Optional `?category=food|transport|utilities|other` to filter.
- `POST /api/expenses` — create a new expense. Validates title, amount (must be a positive number), category, and date server-side.
- `DELETE /api/expenses/:id` — delete by id. Returns 404 if not found.

## Tech

- Next.js (App Router) + TypeScript
- SQLite via `better-sqlite3` with raw SQL
- Plain CSS Modules for styling
- React state only — no external state libraries

## Notes / Trade-offs

- The initial server-rendered list comes straight from a `db.prepare(...).all()` call in the Server Component. Subsequent client interactions (filter change, add, delete) go through the API. This satisfies the "Server Component for initial render" requirement and keeps the client interactions simple.
- Validation is duplicated lightly (client-side for UX, server-side as the source of truth). With more time I'd pull both into a shared validator (or a Zod schema).
- Delete failure currently shows a browser `alert()` — a toast would be nicer.
- No automated tests. With more time I'd add a few route handler tests for the validation and 404 paths.
- The `date` column stores whatever ISO-ish string the client sends (`YYYY-MM-DD` from the date input). Good enough for sorting; a proper app would normalize to UTC ISO strings.
