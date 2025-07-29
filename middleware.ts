
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/api/auth", "/_next", "/favicon.ico", "/public", "/assets"];
const AUTH_PAGE = "/auth";
const JOURNEY_PAGE = "/journey";
const HOME_PAGE = "/";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname.startsWith(AUTH_PAGE)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = AUTH_PAGE;
    return NextResponse.redirect(url);
  }

  const journeyComplete = token.journeyComplete ;

  if (pathname.startsWith(AUTH_PAGE)) {
    const url = req.nextUrl.clone();
    url.pathname = HOME_PAGE;
    return NextResponse.redirect(url);
  }

  if (!journeyComplete && !pathname.startsWith(JOURNEY_PAGE)) {

    const url = req.nextUrl.clone();
    url.pathname = JOURNEY_PAGE;
    return NextResponse.redirect(url);
  }

  if (journeyComplete && pathname.startsWith(JOURNEY_PAGE)) {
    const url = req.nextUrl.clone();
    url.pathname = HOME_PAGE;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function isPublic(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) return true;
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|public).*)"],
};
