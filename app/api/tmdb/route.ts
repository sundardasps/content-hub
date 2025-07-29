import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categories = searchParams.get("categories");
  const page = searchParams.get("page") ?? "1";
  const query = searchParams.get("query");

  let url = "";

  if (query) {
    url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&page=${page}&api_key=${process.env.TMDB_API_KEY}`;
  } else {
    if (!categories) {
      return NextResponse.json(
        { status: "error", message: "Missing categories" },
        { status: 400 }
      );
    }
    const genreParam = categories.split(",")[0]; 
    url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreParam}&page=${page}&api_key=${process.env.TMDB_API_KEY}`;
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

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
