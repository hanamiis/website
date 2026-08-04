import { NextResponse } from "next/server";
import { markAllMessagesRead, MessageStorageError } from "@/lib/messages";

export async function POST() {
  try {
    await markAllMessagesRead();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof MessageStorageError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Gagal menandai pesan sebagai dibaca." }, { status: 500 });
  }
}
