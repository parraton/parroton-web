import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;

function getAPIUrl(request: NextRequest) {
  const url = new URL(request.url ?? '');
  url.pathname = url.pathname.replace('/api/ton-client', '');
  return `${process.env.NEXT_PUBLIC_TON_CLIENT_URL}${url.pathname}${url.search}`;
}

export async function GET(request: NextRequest) {
  const headers = new Headers(request.headers);
  if (apiKey) {
    headers.set('X-API-Key', apiKey);
  }
  const apiUrl = getAPIUrl(request);
  const res = await fetch(apiUrl, { method: 'GET', headers });
  const data = await res.json();

  return NextResponse.json(data, {
    status: res.status,
  });
}

export async function POST(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('X-API-Key', 'toofta');
  const apiUrl = getAPIUrl(request);
  const res = await fetch(apiUrl, { method: 'POST', headers, body: request.body });
  const data = await res.json();

  return NextResponse.json(data, {
    status: res.status,
  });
}
