import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = `
      SELECT f.* FROM field f
      JOIN farm fm ON f.farm_id = fm.id
    `;
    let params: any[] = [];

    if (user.role === "farmer") {
      query += " WHERE fm.farmer_id = $1";
      params.push(user.userId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch fields" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farm_id, name, area } = await req.json();

    if (!farm_id || !name || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify farm ownership for farmers
    if (user.role === "farmer") {
      const farmCheck = await pool.query(
        "SELECT * FROM farm WHERE id = $1 AND farmer_id = $2",
        [farm_id, user.userId]
      );
      if (farmCheck.rows.length === 0) {
        return NextResponse.json({ error: "Farm not found or unauthorized" }, { status: 404 });
      }
    }

    const result = await pool.query(
      "INSERT INTO field (farm_id, name, area) VALUES ($1, $2, $3) RETURNING *",
      [farm_id, name, area]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create field" }, { status: 500 });
  }
}