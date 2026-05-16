import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const result = await pool.query("SELECT * FROM iot_sensor");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch sensors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { type, status, install_date } = await req.json();

    if (!type || !status || !install_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["Temp", "Humidity", "Moist"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO iot_sensor (type, status, install_date) VALUES ($1, $2, $3) RETURNING *",
      [type, status, install_date]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create sensor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id, type, status, install_date } = await req.json();

    if (type && !["Temp", "Humidity", "Moist"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await pool.query(
      "UPDATE iot_sensor SET type = $1, status = $2, install_date = $3 WHERE id = $4 RETURNING *",
      [type, status, install_date, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Sensor not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update sensor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id } = await req.json();

    const result = await pool.query("DELETE FROM iot_sensor WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Sensor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sensor deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete sensor" }, { status: 500 });
  }
}