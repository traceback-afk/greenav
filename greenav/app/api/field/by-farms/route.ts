// app/api/field/by-farms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { farmIds } = await req.json();

    if (!farmIds || !Array.isArray(farmIds) || farmIds.length === 0) {
      return NextResponse.json([]);
    }

    const result = await pool.query(
      `
      SELECT *
      FROM field
      WHERE farm_id = ANY($1)
      `,
      [farmIds]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}