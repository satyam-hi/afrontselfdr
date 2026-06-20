import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const admincode = searchParams.get("code");

  const response = NextResponse.json({
    success: true,
    admincode,
  });

  response.cookies.set("admincode", admincode, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}