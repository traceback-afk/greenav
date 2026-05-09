import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

type RegisterBody = {
  email: string;
  password: string;
  name: string;
  role: "admin" | "farmer";
};

export async function POST(req: NextRequest) {
  const { email, password, name, role }: RegisterBody = await req.json();

  if (!email || !password || !name || !role) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    return Response.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role`,
    [email, hashedPassword, name, role]
  );

  const user = result.rows[0];

  return Response.json({
    message: "User created successfully",
    user,
  });
}