// app/api/iot-sensor/route.ts
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin only" },
        { status: 401 }
      );
    }

    // Query to get sensors with their installed field info
    const query = `
      SELECT
        s.id,
        s.type,
        s.status,
        s.install_date,
        s.sensor_id,
        ii.field_id,
        f.name as field_name,
        f.farm_id
      FROM iot_sensor s
      LEFT JOIN installed_in ii ON s.id = ii.sensor_id
      LEFT JOIN field f ON ii.field_id = f.id
      ORDER BY s.id DESC
    `;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch sensors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin only" },
        { status: 401 }
      );
    }

    const { type, status, install_date, field_id } = await req.json();

    if (!type || !status || !install_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["Temp", "Humidity", "Moist"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert sensor
      const sensorResult = await client.query(
        "INSERT INTO iot_sensor (type, status, install_date) VALUES ($1, $2, $3) RETURNING *",
        [type, status, install_date]
      );

      const sensorId = sensorResult.rows[0].id;

      // If field_id provided, link sensor to field
      if (field_id) {
        await client.query(
          "INSERT INTO installed_in (field_id, sensor_id) VALUES ($1, $2)",
          [field_id, sensorId]
        );
      }

      // Get complete sensor info
      const completeResult = await client.query(
        `SELECT
          s.id,
          s.type,
          s.status,
          s.install_date,
          s.sensor_id,
          ii.field_id,
          f.name as field_name,
          f.farm_id
        FROM iot_sensor s
        LEFT JOIN installed_in ii ON s.id = ii.sensor_id
        LEFT JOIN field f ON ii.field_id = f.id
        WHERE s.id = $1`,
        [sensorId]
      );

      await client.query("COMMIT");
      return NextResponse.json(completeResult.rows[0], { status: 201 });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create sensor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin only" },
        { status: 401 }
      );
    }

    const { id, type, status, install_date, field_id } = await req.json();

    if (type && !["Temp", "Humidity", "Moist"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update sensor
      const result = await client.query(
        "UPDATE iot_sensor SET type = $1, status = $2, install_date = $3 WHERE id = $4 RETURNING *",
        [type, status, install_date, id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Sensor not found" },
          { status: 404 }
        );
      }

      // Update field association if provided
      if (field_id !== undefined) {
        // Remove old associations
        await client.query("DELETE FROM installed_in WHERE sensor_id = $1", [
          id,
        ]);

        // Add new association if field_id is not null
        if (field_id) {
          await client.query(
            "INSERT INTO installed_in (field_id, sensor_id) VALUES ($1, $2)",
            [field_id, id]
          );
        }
      }

      // Get complete sensor info
      const completeResult = await client.query(
        `SELECT
          s.id,
          s.type,
          s.status,
          s.install_date,
          s.sensor_id,
          ii.field_id,
          f.name as field_name,
          f.farm_id
        FROM iot_sensor s
        LEFT JOIN installed_in ii ON s.id = ii.sensor_id
        LEFT JOIN field f ON ii.field_id = f.id
        WHERE s.id = $1`,
        [id]
      );

      await client.query("COMMIT");
      return NextResponse.json(completeResult.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update sensor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin only" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete from installed_in first (due to foreign key)
      await client.query("DELETE FROM installed_in WHERE sensor_id = $1", [id]);

      // Then delete sensor
      const result = await client.query(
        "DELETE FROM iot_sensor WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Sensor not found" },
          { status: 404 }
        );
      }

      await client.query("COMMIT");
      return NextResponse.json({ message: "Sensor deleted successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete sensor" },
      { status: 500 }
    );
  }
}