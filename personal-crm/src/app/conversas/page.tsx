import { getAllConversations } from "@/lib/actions";
import { avatarColor } from "@/lib/utils";
import { format, isToday, isYesterday, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

function dateLabel(date: Date): string {
  if (isToday(date)) return "Hoje";
  if (isYesterday(date)) return "Ontem";
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export default async function ConversasPage() {
  const conversas = await getAllConversations();

  // Group by day
  const groups = new Map<string, typeof conversas>();
  for (const c of conversas) {
    const key = startOfDay(new Date(c.timestamp)).toISOString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Conversas</h1>
        <p className="text-sm text-ink-3 mt-0.5">
          {conversas.length} mensagem{conversas.length !== 1 ? "s" : ""} no total
        </p>
      </div>

      {conversas.length === 0 ? (
        <div className="text-center py-20 text-ink-3">
          <p className="text-sm">Nenhuma conversa ainda.</p>
          <Link href="/contatos" className="text-xs text-accent-fg hover:underline mt-2 block">
            Ir para Contatos →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groups.entries()).map(([key, items]) => (
            <div key={key}>
              {/* Day separator */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                  {dateLabel(new Date(key))}
                </span>
                <div className="flex-1 h-px bg-white/[.05]" />
              </div>

              <ul className="bg-surface rounded-xl border border-white/[.06] divide-y divide-white/[.04] overflow-hidden">
                {items.map((c) => {
                  const av = avatarColor(c.contact.name);
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/contatos/${c.contact.id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-raised transition-colors"
                      >
                        <div
                          className="size-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{ background: av.bg, color: av.text }}
                        >
                          {c.contact.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink">{c.contact.name}</p>
                          <p className="text-xs text-ink-3 truncate mt-0.5">{c.messageText}</p>
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
                          <span className="text-[10px] text-ink-3 tabular-nums w-10 text-right">
                            {format(new Date(c.timestamp), "HH:mm")}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
