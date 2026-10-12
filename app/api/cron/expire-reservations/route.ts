import { NextResponse } from "next/server";
import { expireStaleReservations } from "@/lib/participations/expiry";

export const dynamic = "force-dynamic";

/**
 * Daily backup sweep (Vercel Cron, see vercel.json). Reservations are also
 * expired whenever listing and project pages load. Vercel sends
 * `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const expired = await expireStaleReservations();
  return NextResponse.json({ expired });
}
