"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createContact } from "@/lib/actions";

const fields = [
  { name: "name",        label: "Nome",     required: true  },
  { name: "phoneNumber", label: "Telefone", required: false },
  { name: "email",       label: "E-mail",   required: false },
  { name: "company",     label: "Empresa",  required: false },
];

export default function NewContactButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await createContact({
      name:        fd.get("name") as string,
      phoneNumber: (fd.get("phoneNumber") as string) || undefined,
      email:       (fd.get("email") as string) || undefined,
      company:     (fd.get("company") as string) || undefined,
      notes:       (fd.get("notes") as string) || undefined,
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent/15 text-accent-fg text-sm font-medium hover:bg-accent/25 transition-colors"
      >
        <Plus size={14} strokeWidth={2.5} />
        Novo Contato
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-overlay border border-white/[.09] rounded-2xl shadow-2xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[.06]">
              <h2 className="text-sm font-semibold text-ink">Novo Contato</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-3 hover:text-ink-2 transition-colors p-0.5"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-[11px] font-medium text-ink-3 mb-1.5 uppercase tracking-wider">
                    {f.label}
                  </label>
                  <input
                    name={f.name}
                    required={f.required}
                    className="w-full rounded-lg bg-raised border border-white/[.07] px-3 py-2 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-white/[.18] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-medium text-ink-3 mb-1.5 uppercase tracking-wider">
                  Observações
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full rounded-lg bg-raised border border-white/[.07] px-3 py-2 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-white/[.18] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 text-sm rounded-lg border border-white/[.08] text-ink-2 hover:bg-raised transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 text-sm rounded-lg bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-40 transition-colors"
                >
                  {loading ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
