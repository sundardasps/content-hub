import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tags = searchParams.get("tags")?.split(",") ?? [];

  const posts = tags.map((tag, i) => ({
    id: i,
    platform: "twitter",
    hashtag: `#${tag}`,
    content: `Mock post about ${tag}`,
    author: "mockUser",
    createdAt: new Date().toISOString(),
  }));

  return NextResponse.json(posts);
}
