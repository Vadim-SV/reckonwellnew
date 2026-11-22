import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const availability = await getAvailability();
  return NextResponse.json(availability, { headers: { "Cache-Control": "no-store" } });
}
