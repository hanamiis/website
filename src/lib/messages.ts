import { Redis } from "@upstash/redis";

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

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;
const REDIS_KEY = "mop_messages";
let inMemoryMessages: ContactMessage[] | null = null;

async function readFromRedis(): Promise<ContactMessage[] | null> {
  if (!redis) {
    return null;
  }

  try {
    const stored = await redis.get(REDIS_KEY);
    if (!stored || typeof stored !== "string") {
      return [];
    }

    return JSON.parse(stored) as ContactMessage[];
  } catch (error) {
    console.error("Failed to read messages from Redis", error);
    return null;
  }
}

async function writeToRedis(messages: ContactMessage[]) {
  if (!redis) {
    return;
  }

  try {
    await redis.set(REDIS_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to persist messages to Redis", error);
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  if (inMemoryMessages) {
    return inMemoryMessages;
  }

  if (redis) {
    const fromRedis = await readFromRedis();
    if (fromRedis !== null) {
      inMemoryMessages = fromRedis;
      return fromRedis;
    }
  }

  inMemoryMessages = [];
  return [];
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

  await writeToRedis(messages);

  return nextMessage;
}

export async function markAllMessagesRead() {
  const messages = await readMessages();
  const updated = messages.map((message) => ({ ...message, isRead: true }));
  inMemoryMessages = updated;

  await writeToRedis(updated);

  return updated;
}
