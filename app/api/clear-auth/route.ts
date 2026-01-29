import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { COOKIE } from "@/lib/constants";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE.ACCESS_TOKEN);
  cookieStore.delete(COOKIE.REFRESH_TOKEN);
  return NextResponse.json({
    status: "success",
    message: "Logged out successfully",
  });
}
