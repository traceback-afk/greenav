// app/api/sensor-data/route.ts
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const result = await pool.query("SELECT * FROM sensor_data ORDER BY reading_time DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch sensor data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { value, unit, reading_time } = await req.json();

    if (value === undefined || !unit || !reading_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO sensor_data (value, unit, reading_time) VALUES ($1, $2, $3) RETURNING *",
      [value, unit, reading_time]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create sensor data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id, value, unit, reading_time } = await req.json();

    const result = await pool.query(
      "UPDATE sensor_data SET value = $1, unit = $2, reading_time = $3 WHERE id = $4 RETURNING *",
      [value, unit, reading_time, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Sensor data not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update sensor data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id } = await req.json();

    const result = await pool.query("DELETE FROM sensor_data WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Sensor data not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sensor data deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete sensor data" }, { status: 500 });
  }
}