import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: number;
  role: "admin" | "farmer";
  iat: number;
  exp: number;
};

/**
 * Get the current user from the JWT token in cookies
 * Use this in Server Components or API routes
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(requiredRole: "admin" | "farmer") {
  const user = await getCurrentUser();
  return user?.role === requiredRole;
}

/**
 * Get token from request (for API routes using NextRequest)
 */
export function getTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader
    .split("; ")
    .reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});

  return cookies.token || null;
}