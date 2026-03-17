import { getContacts } from "@/lib/actions";
import Link from "next/link";
import { avatarColor } from "@/lib/utils";
import NewContactButton from "./NewContactButton";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">Contacts</h1>
          <p className="text-sm text-ink-3 mt-0.5">{contacts.length} people</p>
        </div>
        <NewContactButton />
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-20 text-ink-3">
          <p className="text-sm">No contacts yet. Add your first one.</p>
        </div>
      ) : (
        <ul className="bg-surface rounded-xl border border-white/[.06] divide-y divide-white/[.04] overflow-hidden">
          {contacts.map((c) => {
            const av = avatarColor(c.name);
            return (
              <li key={c.id}>
                <Link
                  href={`/contacts/${c.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-raised transition-colors"
                >
                  <div
                    className="size-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{ background: av.bg, color: av.text }}
                  >
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-ink-3 truncate mt-0.5">
                      {[c.company, c.email, c.phoneNumber].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {c._count.conversations > 0 && (
                    <span className="text-[10px] font-medium bg-white/5 text-ink-3 px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                      {c._count.conversations} msgs
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
