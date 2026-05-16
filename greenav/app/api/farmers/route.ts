import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can view all farmers
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admins only" },
        { status: 401 }
      );
    }

    // Query to get all farmers with their farm count
    const query = `
      SELECT
        u.id,
        u.email,
        u.name,
        u.role,
        COUNT(wof.farm_id) as farm_count
      FROM users u
      LEFT JOIN works_on_farm wof ON u.id = wof.farmer_id
      WHERE u.role = 'farmer'
      GROUP BY u.id, u.email, u.name, u.role
      ORDER BY u.name ASC
    `;

    const result = await pool.query(query);

    // Format the response
    const farmers = result.rows.map((row: any) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      farms: parseInt(row.farm_count) || 0,
    }));

    return NextResponse.json(farmers);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch farmers" },
      { status: 500 }
    );
  }
}