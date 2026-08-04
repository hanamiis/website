import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPassword = process.env.DASHBOARD_PASSWORD || "mopteam2026";

    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true, message: "Akses dashboard diberikan." });
      response.cookies.set("dashboard_access", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
}
