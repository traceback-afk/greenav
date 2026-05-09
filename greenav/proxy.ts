import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: number;
  role: "admin" | "farmer";
  iat: number;
  exp: number;
};

function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Allow public routes
  const pathname = req.nextUrl.pathname;
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(token);

  // Invalid token → redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  // Protect farmer routes
  if (pathname.startsWith("/farmer") && user.role !== "farmer") {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/farmer/:path*", "/login", "/register"],
};