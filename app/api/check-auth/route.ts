import { NextResponse } from "next/server";

import { getAuthToken } from "@/lib/api/fetch";

export async function GET() {
  const token = await getAuthToken();
  return NextResponse.json({ token });
}
