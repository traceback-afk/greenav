import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query("SELECT * FROM alert ORDER BY timestamp DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { message, timestamp, severity } = await req.json();

    if (!message || !timestamp || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["Low", "Medium", "High"].includes(severity)) {
      return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO alert (message, timestamp, severity) VALUES ($1, $2, $3) RETURNING *",
      [message, timestamp, severity]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id, message, timestamp, severity } = await req.json();

    if (severity && !["Low", "Medium", "High"].includes(severity)) {
      return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
    }

    const result = await pool.query(
      "UPDATE alert SET message = $1, timestamp = $2, severity = $3 WHERE id = $4 RETURNING *",
      [message, timestamp, severity, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { id } = await req.json();

    const result = await pool.query("DELETE FROM alert WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Alert deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}