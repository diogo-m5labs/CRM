import { getContact } from "@/lib/actions";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, Building2 } from "lucide-react";
import Link from "next/link";
import { avatarColor } from "@/lib/utils";
import MessageThread from "./MessageThread";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) notFound();

  const av = avatarColor(contact.name);

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink-2 transition-colors mb-7"
      >
        <ArrowLeft size={13} /> Contacts
      </Link>

      {/* Contact card */}
      <div className="bg-surface rounded-xl border border-white/[.06] p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="size-12 rounded-full flex items-center justify-center text-lg font-semibold shrink-0"
            style={{ background: av.bg, color: av.text }}
          >
            {contact.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-semibold text-ink">{contact.name}</h1>
            {contact.company && (
              <p className="text-xs text-ink-3 flex items-center gap-1 mt-0.5">
                <Building2 size={11} /> {contact.company}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {contact.phoneNumber && (
            <span className="flex items-center gap-1.5 text-xs text-ink-2">
              <Phone size={12} className="text-ink-3" /> {contact.phoneNumber}
            </span>
          )}
          {contact.email && (
            <span className="flex items-center gap-1.5 text-xs text-ink-2">
              <Mail size={12} className="text-ink-3" /> {contact.email}
            </span>
          )}
        </div>

        {contact.notes && (
          <p className="mt-4 pt-4 text-xs text-ink-3 border-t border-white/[.05] leading-relaxed">
            {contact.notes}
          </p>
        )}
      </div>

      <MessageThread contact={contact} />
    </div>
  );
}
