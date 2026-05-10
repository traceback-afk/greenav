// app/api/field/[id]/route.ts
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farm_id, name, area } = await req.json();
    const id = params.id;

    let query = "UPDATE field SET name = $1, area = $2 WHERE id = $3 AND farm_id = $4";
    let params_arr = [name, area, id, farm_id];

    if (user.role === "farmer") {
      query += " AND farm_id IN (SELECT id FROM farm WHERE farmer_id = $5)";
      params_arr.push(user.userId);
    }

    query += " RETURNING *";

    const result = await pool.query(query, params_arr);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Field not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update field" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    let query = "DELETE FROM field WHERE id = $1";
    let params_arr = [id];

    if (user.role === "farmer") {
      query += " AND farm_id IN (SELECT id FROM farm WHERE farmer_id = $2)";
      params_arr.push(user.userId.toString());
    }

    query += " RETURNING *";

    const result = await pool.query(query, params_arr);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Field not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Field deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete field" }, { status: 500 });
  }
}