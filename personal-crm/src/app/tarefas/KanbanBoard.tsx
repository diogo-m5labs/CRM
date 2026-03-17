"use client";

import { useState } from "react";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, useDroppable, useDraggable,
} from "@dnd-kit/core";
import { createTask, updateTaskStatus, deleteTask } from "@/lib/actions";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Task } from "@prisma/client";

const COLUMNS = ["Todo", "In Progress", "Done"] as const;
type Status = (typeof COLUMNS)[number];

const colMeta: Record<Status, { dot: string; label: string; count: string; display: string }> = {
  "Todo":        { dot: "bg-ink-3",   label: "text-ink-3",   count: "bg-white/5 text-ink-3",       display: "A fazer"       },
  "In Progress": { dot: "bg-warning", label: "text-warning",  count: "bg-warning/10 text-warning",  display: "Em andamento"  },
  "Done":        { dot: "bg-success", label: "text-success",  count: "bg-success/10 text-success",  display: "Concluído"     },
};

function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate(${transform.x}px,${transform.y}px)` } : undefined}
      className={`bg-raised rounded-lg border border-white/[.06] p-3 group transition-opacity ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 text-ink-4 hover:text-ink-3 cursor-grab active:cursor-grabbing shrink-0 transition-colors"
        >
          <GripVertical size={13} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink leading-snug">{task.title}</p>
          {task.description && (
            <p className="text-xs text-ink-3 mt-1 leading-relaxed line-clamp-2">{task.description}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-ink-4 hover:text-danger transition-all shrink-0 p-0.5"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function Column({
  status, tasks, onDelete, onAdd,
}: {
  status: Status;
  tasks: Task[];
  onDelete: (id: string) => void;
  onAdd: (status: Status, title: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const meta = colMeta[status];

  async function handleAdd() {
    if (!newTitle.trim()) return;
    onAdd(status, newTitle.trim());
    setNewTitle("");
    setAdding(false);
  }

  return (
    <div className="flex flex-col w-68 shrink-0" style={{ width: "17rem" }}>
      <div className={`bg-surface rounded-xl border border-white/[.06] flex flex-col transition-colors ${isOver ? "border-white/[.11]" : ""}`}>
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[.05]">
          <span className={`size-1.5 rounded-full shrink-0 ${meta.dot}`} />
          <span className={`text-xs font-medium tracking-wide ${meta.label}`}>{meta.display}</span>
          <span className={`ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full tabular-nums ${meta.count}`}>
            {tasks.length}
          </span>
        </div>

        {/* Drop zone */}
        <div
          ref={setNodeRef}
          className={`flex-1 p-2.5 space-y-2 min-h-24 transition-colors rounded-b-lg ${isOver ? "bg-raised/50" : ""}`}
        >
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onDelete={() => onDelete(t.id)} />
          ))}
        </div>

        {/* Add task */}
        <div className="px-2.5 pb-2.5">
          {adding ? (
            <div className="space-y-1.5">
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
                placeholder="Título da tarefa…"
                className="w-full rounded-lg bg-raised border border-white/[.07] px-3 py-2 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-white/[.18] transition-colors"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-accent/15 text-accent-fg hover:bg-accent/25 transition-colors font-medium"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="flex-1 py-1.5 text-xs rounded-lg border border-white/[.07] text-ink-3 hover:bg-raised transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center gap-1.5 text-xs text-ink-4 hover:text-ink-3 py-1.5 px-2 rounded-lg hover:bg-raised transition-colors"
            >
              <Plus size={12} strokeWidth={2.5} /> Adicionar tarefa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const grouped = COLUMNS.reduce(
    (acc, col) => ({ ...acc, [col]: tasks.filter((t) => t.status === col) }),
    {} as Record<Status, Task[]>
  );

  function handleDragStart(e: DragStartEvent) { setActiveId(e.active.id as string); }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const newStatus = over.id as Status;
    const task = tasks.find((t) => t.id === active.id);
    if (!task || task.status === newStatus) return;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    await updateTaskStatus(task.id, newStatus);
  }

  async function handleAdd(status: Status, title: string) {
    const opt: Task = {
      id: crypto.randomUUID(), title, description: null,
      status, position: 0, createdAt: new Date(), updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, opt]);
    await createTask({ title, status });
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTask(id);
  }

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-6">
        {COLUMNS.map((col) => (
          <Column key={col} status={col} tasks={grouped[col]} onDelete={handleDelete} onAdd={handleAdd} />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="bg-raised rounded-lg border border-white/[.10] p-3 shadow-2xl w-64 opacity-95">
            <p className="text-sm text-ink">{activeTask.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
