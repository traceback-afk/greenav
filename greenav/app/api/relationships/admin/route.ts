import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET_INSTALLED_IN(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const fieldId = req.nextUrl.searchParams.get("field_id");
    let query = "SELECT * FROM installed_in";
    let params: any[] = [];

    if (fieldId) {
      query += " WHERE field_id = $1";
      params.push(fieldId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch installed_in" }, { status: 500 });
  }
}

export async function POST_INSTALLED_IN(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { field_id, sensor_id } = await req.json();

    if (!field_id || !sensor_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO installed_in (field_id, sensor_id) VALUES ($1, $2) RETURNING *",
      [field_id, sensor_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create installed_in" }, { status: 500 });
  }
}

export async function DELETE_INSTALLED_IN(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { field_id, sensor_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM installed_in WHERE field_id = $1 AND sensor_id = $2 RETURNING *",
      [field_id, sensor_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Installed in deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete installed_in" }, { status: 500 });
  }
}

export async function GET_GENERATES(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const sensorId = req.nextUrl.searchParams.get("sensor_id");
    let query = "SELECT * FROM generates";
    let params: any[] = [];

    if (sensorId) {
      query += " WHERE sensor_id = $1";
      params.push(sensorId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch generates" }, { status: 500 });
  }
}

export async function POST_GENERATES(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { sensor_id, sensor_data_id } = await req.json();

    if (!sensor_id || !sensor_data_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO generates (sensor_id, sensor_data_id) VALUES ($1, $2) RETURNING *",
      [sensor_id, sensor_data_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create generates" }, { status: 500 });
  }
}

export async function DELETE_GENERATES(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { sensor_id, sensor_data_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM generates WHERE sensor_id = $1 AND sensor_data_id = $2 RETURNING *",
      [sensor_id, sensor_data_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Generates relationship deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete generates" }, { status: 500 });
  }
}