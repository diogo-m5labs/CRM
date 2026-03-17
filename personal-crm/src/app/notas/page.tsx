import { getNotes } from "@/lib/actions";
import Link from "next/link";
import { format } from "date-fns";
import NewNoteButton from "./NewNoteButton";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">Notas</h1>
          <p className="text-sm text-ink-3 mt-0.5">{notes.length} nota{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <NewNoteButton />
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20 text-ink-3">
          <p className="text-sm">Nenhuma nota ainda. Crie a primeira.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <Link
              key={n.id}
              href={`/notas/${n.id}`}
              className="group block bg-surface rounded-xl border border-white/[.06] p-5 hover:border-white/[.11] hover:bg-raised transition-all"
            >
              <h3 className="text-sm font-medium text-ink truncate mb-3">{n.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-ink-3 tabular-nums">
                  {format(new Date(n.updatedAt), "MMM d, yyyy")}
                </span>
                <span className="text-[10px] text-ink-4 group-hover:text-ink-3 transition-colors">
                  Editar →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
