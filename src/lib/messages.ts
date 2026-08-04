import fs from "fs/promises";
import path from "path";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  projectDetails: string;
  createdAt: string;
  isRead: boolean;
}

const messagesFile = process.env.VERCEL
  ? path.join("/tmp", "messages.json")
  : path.join(process.cwd(), "src", "data", "messages.json");

async function ensureMessagesFile() {
  try {
    await fs.access(messagesFile);
  } catch {
    try {
      await fs.mkdir(path.dirname(messagesFile), { recursive: true });
      await fs.writeFile(messagesFile, "[]", "utf8");
    } catch (error) {
      console.error("Failed to initialize messages storage", error);
      throw error;
    }
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  try {
    await ensureMessagesFile();
    const content = await fs.readFile(messagesFile, "utf8");

    try {
      return JSON.parse(content) as ContactMessage[];
    } catch {
      await fs.writeFile(messagesFile, "[]", "utf8");
      return [];
    }
  } catch (error) {
    console.error("Failed to read messages", error);
    return [];
  }
}

export async function saveMessage(message: Omit<ContactMessage, "id" | "createdAt" | "isRead">) {
  const messages = await readMessages();
  const nextMessage: ContactMessage = {
    ...message,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  messages.unshift(nextMessage);
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), "utf8");
  return nextMessage;
}

export async function markAllMessagesRead() {
  const messages = await readMessages();
  const updated = messages.map((message) => ({ ...message, isRead: true }));
  await fs.writeFile(messagesFile, JSON.stringify(updated, null, 2), "utf8");
  return updated;
}
