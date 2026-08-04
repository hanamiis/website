import fs from "fs/promises";
import path from "path";
import { createClient } from "@vercel/kv";

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

const MESSAGES_KEY = "mop_messages";
const messagesFile = path.join(process.cwd(), "src", "data", "messages.json");
function findUpstashEnvironmentValue(suffix: string) {
  return Object.entries(process.env).find(([name, value]) =>
    name.startsWith("UPSTASH_REDIS") && name.endsWith(suffix) && value
  )?.[1];
}

const redisUrl = process.env.KV_REST_API_URL
  ?? process.env.UPSTASH_REDIS_REST_URL
  ?? findUpstashEnvironmentValue("REST_API_URL");
const redisToken = process.env.KV_REST_API_TOKEN
  ?? process.env.UPSTASH_REDIS_REST_TOKEN
  ?? findUpstashEnvironmentValue("REST_API_TOKEN");
const redis = redisUrl && redisToken ? createClient({ url: redisUrl, token: redisToken }) : null;

export class MessageStorageError extends Error {
  constructor() {
    super("Penyimpanan pesan belum dikonfigurasi. Hubungkan Upstash Redis dan tambahkan environment variables-nya.");
  }
}

function usesFileStorage() {
  return !redis && !process.env.VERCEL;
}

async function ensureMessagesFile() {
  try {
    await fs.access(messagesFile);
  } catch {
    await fs.mkdir(path.dirname(messagesFile), { recursive: true });
    await fs.writeFile(messagesFile, "[]", "utf8");
  }
}

async function readFileMessages(): Promise<ContactMessage[]> {
  await ensureMessagesFile();
  const content = await fs.readFile(messagesFile, "utf8");

  try {
    return JSON.parse(content) as ContactMessage[];
  } catch {
    await fs.writeFile(messagesFile, "[]", "utf8");
    return [];
  }
}

async function writeMessages(messages: ContactMessage[]) {
  if (redis) {
    await redis.set(MESSAGES_KEY, messages);
    return;
  }

  if (!usesFileStorage()) {
    throw new MessageStorageError();
  }

  await ensureMessagesFile();
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), "utf8");
}

export async function readMessages(): Promise<ContactMessage[]> {
  if (redis) {
    return (await redis.get<ContactMessage[]>(MESSAGES_KEY)) ?? [];
  }

  if (!usesFileStorage()) {
    throw new MessageStorageError();
  }

  return readFileMessages();
}

export async function saveMessage(message: Omit<ContactMessage, "id" | "createdAt" | "isRead">) {
  const messages = await readMessages();
  const nextMessage: ContactMessage = {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  await writeMessages([nextMessage, ...messages]);
  return nextMessage;
}

export async function markAllMessagesRead() {
  const messages = await readMessages();
  const updated = messages.map((message) => ({ ...message, isRead: true }));
  await writeMessages(updated);
  return updated;
}
