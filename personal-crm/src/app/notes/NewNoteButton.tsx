"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createNote } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function NewNoteButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle() {
    setLoading(true);
    const note = await createNote({ title: "Untitled" });
    router.push(`/notes/${note.id}`);
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent/15 text-accent-fg text-sm font-medium hover:bg-accent/25 disabled:opacity-40 transition-colors"
    >
      <Plus size={14} strokeWidth={2.5} />
      New Note
    </button>
  );
}
