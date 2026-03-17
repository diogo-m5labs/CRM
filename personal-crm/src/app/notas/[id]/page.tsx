import { getNote } from "@/lib/actions";
import { notFound } from "next/navigation";
import NoteEditor from "./NoteEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/notas"
        className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink-2 transition-colors mb-7"
      >
        <ArrowLeft size={13} /> Notas
      </Link>
      <NoteEditor note={note} />
    </div>
  );
}
