"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

// ── Contacts ─────────────────────────────────────────────────────────────────

export async function getContacts() {
  return prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { conversations: true } } },
  });
}

export async function getContact(id: string) {
  return prisma.contact.findUnique({
    where: { id },
    include: { conversations: { orderBy: { timestamp: "asc" } } },
  });
}

export async function createContact(data: {
  name: string;
  phoneNumber?: string;
  email?: string;
  company?: string;
  notes?: string;
}) {
  await prisma.contact.create({ data });
  revalidatePath("/contatos");
}

export async function updateContact(
  id: string,
  data: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    company?: string;
    notes?: string;
  }
) {
  await prisma.contact.update({ where: { id }, data });
  revalidatePath("/contatos");
  revalidatePath(`/contatos/${id}`);
}

export async function deleteContact(id: string) {
  await prisma.contact.delete({ where: { id } });
  revalidatePath("/contatos");
}

// ── Conversations ─────────────────────────────────────────────────────────────

export async function addMessage(data: {
  contactId: string;
  messageText: string;
  direction: "inbound" | "outbound";
}) {
  await prisma.conversation.create({ data });
  revalidatePath(`/contatos/${data.contactId}`);
  revalidatePath("/conversas");
}

export async function getAllConversations() {
  return prisma.conversation.findMany({
    orderBy: { timestamp: "desc" },
    include: { contact: { select: { id: true, name: true } } },
  });
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export async function getNotes() {
  return prisma.note.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getNote(id: string) {
  return prisma.note.findUnique({ where: { id } });
}

export async function createNote(data: { title: string; content?: string }) {
  const note = await prisma.note.create({ data: { title: data.title, content: data.content ?? "" } });
  revalidatePath("/notas");
  return note;
}

export async function updateNote(id: string, data: { title?: string; content?: string }) {
  await prisma.note.update({ where: { id }, data });
  revalidatePath("/notas");
  revalidatePath(`/notas/${id}`);
}

export async function deleteNote(id: string) {
  await prisma.note.delete({ where: { id } });
  revalidatePath("/notas");
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks() {
  return prisma.task.findMany({ orderBy: [{ status: "asc" }, { position: "asc" }] });
}

export async function createTask(data: {
  title: string;
  description?: string;
  status?: string;
}) {
  const count = await prisma.task.count({ where: { status: data.status ?? "Todo" } });
  await prisma.task.create({ data: { ...data, position: count } });
  revalidatePath("/tarefas");
}

export async function updateTaskStatus(id: string, status: string) {
  await prisma.task.update({ where: { id }, data: { status } });
  revalidatePath("/tarefas");
}

export async function updateTask(id: string, data: { title?: string; description?: string; status?: string }) {
  await prisma.task.update({ where: { id }, data });
  revalidatePath("/tarefas");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/tarefas");
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [contacts, notes, tasks, recentConversations] = await Promise.all([
    prisma.contact.count(),
    prisma.note.count(),
    prisma.task.groupBy({ by: ["status"], _count: true }),
    prisma.conversation.findMany({
      take: 5,
      orderBy: { timestamp: "desc" },
      include: { contact: true },
    }),
  ]);
  return { contacts, notes, tasks, recentConversations };
}
