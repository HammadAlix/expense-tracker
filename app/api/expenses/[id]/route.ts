import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const expenseId = parseInt(id, 10);

  if (isNaN(expenseId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(expenseId);

  if (result.changes === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
