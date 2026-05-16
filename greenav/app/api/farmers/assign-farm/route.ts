import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // adjust path to your pool file

export async function POST(req: NextRequest) {
  try {
    const { farmerId, farmId } = await req.json();

    if (!farmerId || !farmId) {
      return NextResponse.json(
        { error: "farmerId and farmId are required" },
        { status: 400 }
      );
    }

    // 1. check farmer exists + role
    const farmerResult = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [farmerId]
    );

    const farmer = farmerResult.rows[0];

    if (!farmer || farmer.role !== "farmer") {
      return NextResponse.json(
        { error: "Invalid farmer" },
        { status: 400 }
      );
    }

    // 2. check farm exists
    const farmResult = await pool.query(
      "SELECT id FROM farm WHERE id = $1",
      [farmId]
    );

    if (farmResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Farm not found" },
        { status: 404 }
      );
    }

    // 3. insert relationship (avoid duplicates)
    await pool.query(
      `
      INSERT INTO works_on_farm (farmer_id, farm_id)
      VALUES ($1, $2)
      ON CONFLICT (farmer_id, farm_id) DO NOTHING
      `,
      [farmerId, farmId]
    );

    return NextResponse.json({
      success: true,
      message: "Farmer assigned to farm",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}