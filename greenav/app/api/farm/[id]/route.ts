import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update farms
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admins only" },
        { status: 401 }
      );
    }

    const { name, size, location, soil_type, planting_date, harvest_date } =
      await req.json();
    const { id } = await params;

    const query =
      "UPDATE farm SET name = $1, size = $2, location = $3, soil_type = $4, planting_date = $5, harvest_date = $6 WHERE id = $7 RETURNING *";
    const queryParams = [
      name,
      size,
      location,
      soil_type,
      planting_date,
      harvest_date,
      id,
    ];

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update farm" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete farms
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admins only" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const query = "DELETE FROM farm WHERE id = $1 RETURNING *";
    const queryParams = [id];

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Farm deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete farm" },
      { status: 500 }
    );
  }
}