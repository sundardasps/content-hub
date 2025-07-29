
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "general";
  const page = searchParams.get("page") ?? "1";

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(
    category
  )}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.status !== "ok") {
      return NextResponse.json(
        { status: "error", message: data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json(
      { status: "error", message: e.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
