import { NextResponse } from "next/server";
import { markAllMessagesRead } from "@/lib/messages";

export async function POST() {
  try {
    await markAllMessagesRead();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menandai pesan sebagai dibaca." }, { status: 500 });
  }
}
