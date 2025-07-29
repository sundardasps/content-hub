
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";

  const url = `https://api.themoviedb.org/3/trending/movie/day?page=${page}&api_key=${process.env.TMDB_API_KEY}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    return NextResponse.json({
      page: data.page,
      results: data.results,
      total_pages: data.total_pages,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { status: "error", message: e.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
