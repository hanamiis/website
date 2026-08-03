import { NextResponse } from "next/server";
import { readMessages } from "@/lib/messages";

export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}
