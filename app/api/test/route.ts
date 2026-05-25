import { NextResponse } from 'next/server';
import { infiniteGrocery } from '@/actions/more-section/infiniteGrocery';

export const GET = async () => {
  try {
    const res = await infiniteGrocery({});
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
