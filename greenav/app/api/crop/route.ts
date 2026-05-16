import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query("SELECT * FROM crop");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch crops" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { name, growth_duration, local_temp, ideal_moisture } = await req.json();

    if (!name || !growth_duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO crop (name, growth_duration, local_temp, ideal_moisture) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, growth_duration, local_temp, ideal_moisture]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create crop" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id, name, growth_duration, local_temp, ideal_moisture } = await req.json();

    const result = await pool.query(
      "UPDATE crop SET name = $1, growth_duration = $2, local_temp = $3, ideal_moisture = $4 WHERE id = $5 RETURNING *",
      [name, growth_duration, local_temp, ideal_moisture, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update crop" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id } = await req.json();

    const result = await pool.query("DELETE FROM crop WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Crop deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete crop" }, { status: 500 });
  }
}