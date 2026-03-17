"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, StickyNote, CheckSquare, LayoutDashboard, MessageSquare, LogOut } from "lucide-react";
import { logoutAction } from "./logout-action";

const nav = [
  { href: "/",           label: "Início",     icon: LayoutDashboard },
  { href: "/contatos",   label: "Contatos",   icon: Users },
  { href: "/conversas",  label: "Conversas",  icon: MessageSquare },
  { href: "/notas",      label: "Notas",      icon: StickyNote },
  { href: "/tarefas",    label: "Tarefas",    icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="w-52 shrink-0 flex flex-col bg-surface border-r border-white/[.06]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[.05]">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-md bg-accent/20 flex items-center justify-center">
            <div className="size-2.5 rounded-sm bg-accent" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-ink">Personal CRM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                transition-colors duration-100
                ${active
                  ? "bg-accent/[.12] text-accent-fg"
                  : "text-ink-3 hover:bg-raised hover:text-ink-2"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />
              )}
              <Icon size={15} strokeWidth={active ? 2 : 1.75} />
              <span className={active ? "font-medium" : ""}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sair */}
      <div className="px-2 pb-3 border-t border-white/[.05] pt-2">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-3 hover:bg-raised hover:text-ink-2 transition-colors"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
