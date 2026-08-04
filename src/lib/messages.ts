import fs from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";

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

const primaryMessagesFile = path.join(process.cwd(), "src", "data", "messages.json");
const fallbackMessagesFile = process.env.VERCEL ? "/tmp/messages.json" : path.join(process.cwd(), "tmp", "messages.json");
const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
let inMemoryMessages: ContactMessage[] | null = null;

async function getMessagesFilePath() {
  const candidates = [primaryMessagesFile, fallbackMessagesFile];

  for (const candidate of candidates) {
    try {
      await fs.mkdir(path.dirname(candidate), { recursive: true });
      await fs.writeFile(candidate, "[]", "utf8");
      return candidate;
    } catch {
      // try the next candidate
    }
  }

  return fallbackMessagesFile;
}

async function ensureMessagesFile() {
  const filePath = await getMessagesFilePath();

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }

  return filePath;
}

async function readFromBlob(): Promise<ContactMessage[] | null> {
  if (!blobToken) {
    return null;
  }

  try {
    const { blobs } = await list({ prefix: "messages.json", token: blobToken });
    const blob = blobs.find((item) => item.pathname === "messages.json");

    if (!blob) {
      return [];
    }

    const response = await fetch(blob.url);
    if (!response.ok) {
      return [];
    }

    const content = await response.text();
    return JSON.parse(content) as ContactMessage[];
  } catch (error) {
    console.error("Failed to read messages from blob", error);
    return null;
  }
}

async function writeToBlob(messages: ContactMessage[]) {
  if (!blobToken) {
    return;
  }

  try {
    await put("messages.json", JSON.stringify(messages, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: blobToken,
    });
  } catch (error) {
    console.error("Failed to persist messages to blob", error);
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  if (inMemoryMessages) {
    return inMemoryMessages;
  }

  try {
    const fromBlob = await readFromBlob();
    if (fromBlob !== null) {
      inMemoryMessages = fromBlob;
      return fromBlob;
    }

    const filePath = await ensureMessagesFile();
    const content = await fs.readFile(filePath, "utf8");

    try {
      const parsed = JSON.parse(content) as ContactMessage[];
      inMemoryMessages = parsed;
      return parsed;
    } catch {
      await fs.writeFile(filePath, "[]", "utf8");
      inMemoryMessages = [];
      return [];
    }
  } catch (error) {
    console.error("Failed to read messages", error);
    inMemoryMessages = [];
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
  inMemoryMessages = messages;

  try {
    await writeToBlob(messages);

    const filePath = await ensureMessagesFile();
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to persist messages", error);
  }

  return nextMessage;
}

export async function markAllMessagesRead() {
  const messages = await readMessages();
  const updated = messages.map((message) => ({ ...message, isRead: true }));
  inMemoryMessages = updated;

  try {
    await writeToBlob(updated);

    const filePath = await ensureMessagesFile();
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to persist read status", error);
  }

  return updated;
}
