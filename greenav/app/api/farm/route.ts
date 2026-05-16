import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = "SELECT f.*, u.name as farmer_name FROM farm f JOIN users u ON f.farmer_id = u.id";
    let params: any[] = [];

    if (user.role === "farmer") {
      query += " WHERE f.farmer_id = $1";
      params.push(user.userId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch farms" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmer_id, name, size, location, soil_type, planting_date, harvest_date } = await req.json();

    if (!name || !size || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const actualFarmerId = user.role === "farmer" ? user.userId : (farmer_id || user.userId);

    const result = await pool.query(
      "INSERT INTO farm (farmer_id, name, size, location, soil_type, planting_date, harvest_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [actualFarmerId, name, size, location, soil_type, planting_date, harvest_date]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create farm" }, { status: 500 });
  }
}