

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categories = searchParams.get("categories");
  const page = searchParams.get("page") ?? "1";
  const query = searchParams.get("q") ?? "";

  const category = categories?.split(",")[0] ?? "general";

  const url = `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`;


  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();

    if (data.status !== 'ok') {
      return NextResponse.json(
        { status: 'error', message: data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
