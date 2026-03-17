import { getDashboardStats } from "@/lib/actions";
import { avatarColor } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default async function DashboardPage() {
  const { contacts, notes, tasks, recentConversations } = await getDashboardStats();

  const todo       = tasks.find((t) => t.status === "Todo")?._count        ?? 0;
  const inProgress = tasks.find((t) => t.status === "In Progress")?._count ?? 0;
  const done       = tasks.find((t) => t.status === "Done")?._count        ?? 0;
  const totalTasks = todo + inProgress + done;

  const pct = (n: number) => (totalTasks > 0 ? Math.round((n / totalTasks) * 100) : 0);

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Início</h1>
        <p className="text-sm text-ink-3 mt-0.5">Visão geral dos seus relacionamentos</p>
      </div>

      {/* Stat bar */}
      <div className="bg-surface rounded-xl border border-white/[.06] flex divide-x divide-white/[.06] mb-6 overflow-hidden">
        {[
          { label: "Contatos",        value: contacts          },
          { label: "Notas",           value: notes             },
          { label: "Tarefas abertas", value: todo + inProgress },
          { label: "Concluídas",      value: done              },
        ].map(({ label, value }) => (
          <div key={label} className="flex-1 px-7 py-6">
            <p className="text-4xl font-bold text-ink tracking-tight tabular-nums leading-none">
              {value}
            </p>
            <p className="text-xs text-ink-3 mt-2.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Two-column */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>

        {/* Conversas recentes */}
        <div className="bg-surface rounded-xl border border-white/[.06] flex flex-col min-h-64">
          <div className="px-6 py-4 border-b border-white/[.05] flex items-center justify-between">
            <h2 className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
              Conversas Recentes
            </h2>
            <Link href="/conversas" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">
              Ver todas →
            </Link>
          </div>

          {recentConversations.length === 0 ? (
            <p className="px-6 py-10 text-sm text-ink-3 text-center m-auto">Nenhuma conversa ainda.</p>
          ) : (
            <ul className="divide-y divide-white/[.04]">
              {recentConversations.map((c) => {
                const av = avatarColor(c.contact.name);
                return (
                  <li key={c.id}>
                    <Link
                      href={`/contatos/${c.contact.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-raised/60 transition-colors"
                    >
                      <div
                        className="size-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                        style={{ background: av.bg, color: av.text }}
                      >
                        {c.contact.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink leading-none">{c.contact.name}</p>
                        <p className="text-xs text-ink-3 mt-1.5 truncate">{c.messageText}</p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            c.direction === "inbound"
                              ? "bg-accent/10 text-accent-fg"
                              : "bg-white/5 text-ink-3"
                          }`}
                        >
                          {c.direction === "inbound" ? "recebida" : "enviada"}
                        </span>
                        <span className="text-[10px] text-ink-3 tabular-nums w-16 text-right">
                          {formatDistanceToNow(new Date(c.timestamp), { addSuffix: true, locale: ptBR })}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Coluna direita */}
        <div className="space-y-4">

          {/* Tarefas */}
          <div className="bg-surface rounded-xl border border-white/[.06]">
            <div className="px-5 py-4 border-b border-white/[.05] flex items-center justify-between">
              <h2 className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Tarefas</h2>
              <Link href="/tarefas" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">Ver →</Link>
            </div>
            <div className="px-5 py-5 space-y-4">
              {[
                { label: "A fazer",       count: todo,       bar: "bg-ink-3"   },
                { label: "Em andamento",  count: inProgress, bar: "bg-warning" },
                { label: "Concluído",     count: done,       bar: "bg-success" },
              ].map(({ label, count, bar }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-ink-2">{label}</span>
                    <span className="text-xs text-ink-3 tabular-nums">{count}</span>
                  </div>
                  <div className="h-[3px] bg-white/[.05] rounded-full overflow-hidden">
                    <div className={`h-full ${bar} rounded-full transition-all duration-500`}
                      style={{ width: `${pct(count)}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-ink-3 pt-1 border-t border-white/[.05] tabular-nums">
                {totalTasks} tarefas no total
              </p>
            </div>
          </div>

          {/* Notas */}
          <div className="bg-surface rounded-xl border border-white/[.06]">
            <div className="px-5 py-4 border-b border-white/[.05] flex items-center justify-between">
              <h2 className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Notas</h2>
              <Link href="/notas" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">Ver →</Link>
            </div>
            <div className="px-5 py-5 flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-ink tabular-nums leading-none">{notes}</p>
                <p className="text-xs text-ink-3 mt-2.5 font-medium">notas salvas</p>
              </div>
              <Link href="/notas"
                className="text-xs bg-accent/10 text-accent-fg px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors font-medium">
                + Nova
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
