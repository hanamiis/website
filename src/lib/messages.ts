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

const messagesFile = path.join(process.cwd(), "src", "data", "messages.json");

type GlobalWithMessages = typeof globalThis & {
  __nyobaaMessages?: ContactMessage[];
};

const globalMessages = globalThis as GlobalWithMessages;

async function ensureMessagesFile() {
  try {
    await fs.access(messagesFile);
  } catch {
    try {
      await fs.mkdir(path.dirname(messagesFile), { recursive: true });
      await fs.writeFile(messagesFile, "[]", "utf8");
    } catch {
      // Ignore filesystem errors in hosting environments.
    }
  }
}

async function persistMessages(messages: ContactMessage[]) {
  try {
    await ensureMessagesFile();
    await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), "utf8");
  } catch {
    // Ignore filesystem errors in hosting environments.
  }
}

function mergeMessages(fileMessages: ContactMessage[] | null): ContactMessage[] {
  const memoryMessages = globalMessages.__nyobaaMessages ?? [];
  const merged = [...memoryMessages, ...(fileMessages ?? [])];
  const uniqueMessages = new Map<string, ContactMessage>();

  merged.forEach((message) => {
    uniqueMessages.set(message.id, message);
  });

  const orderedMessages = Array.from(uniqueMessages.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  globalMessages.__nyobaaMessages = orderedMessages;
  return orderedMessages;
}

export async function readMessages(): Promise<ContactMessage[]> {
  try {
    await ensureMessagesFile();
    const content = await fs.readFile(messagesFile, "utf8");
    const parsedMessages = JSON.parse(content) as ContactMessage[];
    return mergeMessages(parsedMessages);
  } catch {
    return mergeMessages(null);
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

  const updatedMessages = [nextMessage, ...messages.filter((item) => item.id !== nextMessage.id)];
  globalMessages.__nyobaaMessages = updatedMessages;
  await persistMessages(updatedMessages);
  return nextMessage;
}

export async function markAllMessagesRead() {
  const messages = await readMessages();
  const updated = messages.map((message) => ({ ...message, isRead: true }));
  globalMessages.__nyobaaMessages = updated;
  await persistMessages(updated);
  return updated;
}
