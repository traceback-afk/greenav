import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = "SELECT f.* FROM farm f";
    let params: any[] = [];

    // Farmers see only farms they work on
    if (user.role === "farmer") {
      query += " JOIN works_on_farm wof ON f.id = wof.farm_id WHERE wof.farmer_id = $1";
      params.push(user.userId);
    }

    query += " ORDER BY f.name";

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

    // Only admins can create farms
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admins only" },
        { status: 401 }
      );
    }

    const { name, size, location, soil_type, planting_date, harvest_date } =
      await req.json();

    if (!name || !size || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO farm (name, size, location, soil_type, planting_date, harvest_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, size, location, soil_type, planting_date, harvest_date]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create farm" },
      { status: 500 }
    );
  }
}