import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, size, location, soil_type, planting_date, harvest_date } = await req.json();
    const id = params.id;

    let query =
      "UPDATE farm SET name = $1, size = $2, location = $3, soil_type = $4, planting_date = $5, harvest_date = $6 WHERE id = $7";
    let params_arr = [name, size, location, soil_type, planting_date, harvest_date, id];

    if (user.role === "farmer") {
      query += " AND farmer_id = $8";
      params_arr.push(user.userId);
    }

    query += " RETURNING *";

    const result = await pool.query(query, params_arr);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Farm not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update farm" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    let query = "DELETE FROM farm WHERE id = $1";
    let params_arr = [id];

    if (user.role === "farmer") {
      query += " AND farmer_id = $2";
      params_arr.push(user.userId.toString());
    }

    query += " RETURNING *";

    const result = await pool.query(query, params_arr);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Farm not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Farm deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete farm" }, { status: 500 });
  }
}