import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type LoginBody = {
  email: string;
  password: string;
};

type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "farmer";
};

export async function POST(req: NextRequest) {
  const { email, password }: LoginBody = await req.json();

  const userResult = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  const user = userResult.rows[0];

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const role = user.role;

  const token = jwt.sign(
    {
      userId: user.id,
      role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
    },
  });
  
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}