// app/api/relationships/route.ts
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// ===== CONTAINS (Field Contains Crop) =====
export async function GET_CONTAINS(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fieldId = req.nextUrl.searchParams.get("field_id");
    let query = "SELECT * FROM contains";
    let params: any[] = [];

    if (fieldId) {
      query += " WHERE field_id = $1";
      params.push(fieldId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch contains" }, { status: 500 });
  }
}

export async function POST_CONTAINS(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { field_id, crop_id } = await req.json();

    if (!field_id || !crop_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO contains (field_id, crop_id) VALUES ($1, $2) RETURNING *",
      [field_id, crop_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create contains" }, { status: 500 });
  }
}

export async function DELETE_CONTAINS(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { field_id, crop_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM contains WHERE field_id = $1 AND crop_id = $2 RETURNING *",
      [field_id, crop_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contains relationship deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete contains" }, { status: 500 });
  }
}

// ===== WORKS_ON_FARM =====
export async function GET_WORKS_ON_FARM(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const farmId = req.nextUrl.searchParams.get("farm_id");
    let query = "SELECT * FROM works_on_farm";
    let params: any[] = [];

    if (farmId) {
      query += " WHERE farm_id = $1";
      params.push(farmId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch works_on_farm" }, { status: 500 });
  }
}

export async function POST_WORKS_ON_FARM(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { farm_id, machine_id } = await req.json();

    if (!farm_id || !machine_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO works_on_farm (farm_id, machine_id) VALUES ($1, $2) RETURNING *",
      [farm_id, machine_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create works_on_farm" }, { status: 500 });
  }
}

export async function DELETE_WORKS_ON_FARM(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { farm_id, machine_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM works_on_farm WHERE farm_id = $1 AND machine_id = $2 RETURNING *",
      [farm_id, machine_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Works on farm deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete works_on_farm" }, { status: 500 });
  }
}

// ===== WORKS_ON_FIELD =====
export async function GET_WORKS_ON_FIELD(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fieldId = req.nextUrl.searchParams.get("field_id");
    let query = "SELECT * FROM works_on_field";
    let params: any[] = [];

    if (fieldId) {
      query += " WHERE field_id = $1";
      params.push(fieldId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch works_on_field" }, { status: 500 });
  }
}

export async function POST_WORKS_ON_FIELD(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { field_id, machine_id } = await req.json();

    if (!field_id || !machine_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO works_on_field (field_id, machine_id) VALUES ($1, $2) RETURNING *",
      [field_id, machine_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create works_on_field" }, { status: 500 });
  }
}

export async function DELETE_WORKS_ON_FIELD(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 401 });
    }

    const { field_id, machine_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM works_on_field WHERE field_id = $1 AND machine_id = $2 RETURNING *",
      [field_id, machine_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Works on field deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete works_on_field" }, { status: 500 });
  }
}

// ===== PLANTED_IN =====
export async function GET_PLANTED_IN(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cropId = req.nextUrl.searchParams.get("crop_id");
    let query = "SELECT * FROM planted_in";
    let params: any[] = [];

    if (cropId) {
      query += " WHERE crop_id = $1";
      params.push(cropId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch planted_in" }, { status: 500 });
  }
}

export async function POST_PLANTED_IN(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { crop_id, field_id } = await req.json();

    if (!crop_id || !field_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO planted_in (crop_id, field_id) VALUES ($1, $2) RETURNING *",
      [crop_id, field_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create planted_in" }, { status: 500 });
  }
}

export async function DELETE_PLANTED_IN(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { crop_id, field_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM planted_in WHERE crop_id = $1 AND field_id = $2 RETURNING *",
      [crop_id, field_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Planted in deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete planted_in" }, { status: 500 });
  }
}