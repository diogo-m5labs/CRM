"use client";

import { useState } from "react";
import { addMessage } from "@/lib/actions";
import { format } from "date-fns";
import { Send, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Contact, Conversation } from "@prisma/client";

type Props = {
  contact: Contact & { conversations: Conversation[] };
};

export default function MessageThread({ contact }: Props) {
  const [messages, setMessages] = useState(contact.conversations);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [direction, setDirection] = useState<"outbound" | "inbound">("outbound");

  async function send() {
    if (!text.trim()) return;
    setSending(true);
    await addMessage({ contactId: contact.id, messageText: text, direction });
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        contactId: contact.id,
        messageText: text,
        direction,
        timestamp: new Date(),
      },
    ]);
    setText("");
    setSending(false);
  }

  return (
    <div className="bg-surface rounded-xl border border-white/[.06] flex flex-col overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/[.05]">
        <h2 className="text-xs font-medium text-ink-3 uppercase tracking-widest">
          Conversation — {messages.length} messages
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 space-y-3 min-h-[180px] max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-ink-3 text-center py-8">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                  m.direction === "outbound"
                    ? "bg-accent text-white rounded-br-sm"
                    : "bg-raised text-ink rounded-bl-sm"
                }`}
              >
                <p>{m.messageText}</p>
                <p className={`text-[10px] mt-1.5 tabular-nums ${
                  m.direction === "outbound" ? "text-white/50" : "text-ink-3"
                }`}>
                  {format(new Date(m.timestamp), "MMM d · HH:mm")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-white/[.05] flex gap-2 items-center">
        <button
          onClick={() => setDirection(d => d === "outbound" ? "inbound" : "outbound")}
          className={`shrink-0 p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            direction === "outbound"
              ? "bg-accent/10 text-accent-fg"
              : "bg-success/10 text-success"
          }`}
          title="Toggle direction"
        >
          {direction === "outbound"
            ? <ArrowUpRight size={13} />
            : <ArrowDownLeft size={13} />
          }
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write a message…"
          className="flex-1 rounded-lg bg-raised border border-white/[.07] px-3 py-2 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-white/[.18] transition-colors"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="shrink-0 p-2 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-30 transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
