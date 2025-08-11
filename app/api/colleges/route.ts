import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://colleges-api-india.fly.dev';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || '';

  if (!keyword) {
    return NextResponse.json({ error: 'Missing keyword' }, { status: 400 });
  }

  const res = await fetch(`${API_BASE}/colleges/search`, {
    method: 'POST',
    headers: {
      'Keyword': keyword,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }

  const data: string[][] = await res.json();

  // Extract only college names (3rd element in each array)
  const collegeNames = data.map(item => item[2]);

  return NextResponse.json({ colleges: collegeNames });
}
