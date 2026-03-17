import { getDashboardStats } from "@/lib/actions";
import { avatarColor } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const { contacts, notes, tasks, recentConversations } = await getDashboardStats();

  const todo       = tasks.find((t) => t.status === "Todo")?._count ?? 0;
  const inProgress = tasks.find((t) => t.status === "In Progress")?._count ?? 0;
  const done       = tasks.find((t) => t.status === "Done")?._count ?? 0;

  const stats = [
    { label: "Contacts",     value: contacts,             accent: "bg-accent/10  border-l-accent/40"  },
    { label: "Notes",        value: notes,                accent: "bg-warning/10 border-l-warning/40" },
    { label: "Open tasks",   value: todo + inProgress,    accent: "bg-danger/10  border-l-danger/40"  },
    { label: "Completed",    value: done,                 accent: "bg-success/10 border-l-success/40" },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Dashboard</h1>
        <p className="text-sm text-ink-3 mt-0.5">Overview of your relationships and work</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        {stats.map(({ label, value, accent }) => (
          <div
            key={label}
            className={`rounded-xl border-l-2 border border-white/[.06] p-4 ${accent}`}
          >
            <p className="text-2xl font-semibold text-ink tracking-tight">{value}</p>
            <p className="text-xs text-ink-3 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Conversations */}
      <div className="bg-surface rounded-xl border border-white/[.06]">
        <div className="px-5 py-4 border-b border-white/[.05] flex items-center justify-between">
          <h2 className="text-xs font-medium text-ink-3 uppercase tracking-widest">
            Recent Conversations
          </h2>
          <Link href="/contacts" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">
            View all →
          </Link>
        </div>

        {recentConversations.length === 0 ? (
          <p className="px-5 py-8 text-sm text-ink-3 text-center">No conversations yet.</p>
        ) : (
          <ul className="divide-y divide-white/[.04]">
            {recentConversations.map((c) => {
              const av = avatarColor(c.contact.name);
              return (
                <li key={c.id}>
                  <Link
                    href={`/contacts/${c.contact.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-raised/50 transition-colors"
                  >
                    <div
                      className="size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                      style={{ background: av.bg, color: av.text }}
                    >
                      {c.contact.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{c.contact.name}</p>
                      <p className="text-xs text-ink-3 truncate mt-0.5">{c.messageText}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          c.direction === "inbound"
                            ? "bg-accent/10 text-accent-fg"
                            : "bg-white/5 text-ink-3"
                        }`}
                      >
                        {c.direction}
                      </span>
                      <span className="text-[10px] text-ink-3 tabular-nums">
                        {formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
