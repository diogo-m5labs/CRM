"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { updateNote, deleteNote } from "@/lib/actions";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Note } from "@prisma/client";
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Heading2, Trash2, Check,
} from "lucide-react";

function ToolBtn({
  onClick, active, children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? "bg-raised text-ink"
          : "text-ink-3 hover:bg-raised hover:text-ink-2"
      }`}
    >
      {children}
    </button>
  );
}

export default function NoteEditor({ note }: { note: Note }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [saved, setSaved] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: note.content || "",
    onUpdate: () => setSaved(false),
  });

  const save = useCallback(async () => {
    if (!editor) return;
    await updateNote(note.id, { title, content: editor.getHTML() });
    setSaved(true);
  }, [editor, note.id, title]);

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    await deleteNote(note.id);
    router.push("/notes");
  }

  return (
    <div className="bg-surface rounded-xl border border-white/[.06] overflow-hidden">
      {/* Title + actions */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[.05]">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
          onBlur={save}
          className="flex-1 text-base font-semibold text-ink bg-transparent outline-none placeholder:text-ink-4 tracking-tight"
          placeholder="Note title"
        />
        <div className="flex items-center gap-2 shrink-0">
          {saved ? (
            <span className="text-[10px] text-ink-3 flex items-center gap-1">
              <Check size={11} /> Saved
            </span>
          ) : (
            <button
              onClick={save}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent/15 text-accent-fg font-medium hover:bg-accent/25 transition-colors"
            >
              Save
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-ink-3 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-0.5 px-5 py-2 border-b border-white/[.04]">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold size={13} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic size={13} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
            <Strikethrough size={13} />
          </ToolBtn>
          <div className="w-px h-3.5 bg-white/[.07] mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
            <Heading2 size={13} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <List size={13} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
            <ListOrdered size={13} />
          </ToolBtn>
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="px-6 py-5 min-h-72 text-sm"
      />
    </div>
  );
}
