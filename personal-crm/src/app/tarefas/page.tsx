import { getTasks } from "@/lib/actions";
import KanbanBoard from "./KanbanBoard";

export default async function TasksPage() {
  const tasks = await getTasks();
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Tarefas</h1>
        <p className="text-sm text-ink-3 mt-0.5">{tasks.length} tarefas distribuídas nas colunas</p>
      </div>
      <KanbanBoard initialTasks={tasks} />
    </div>
  );
}
