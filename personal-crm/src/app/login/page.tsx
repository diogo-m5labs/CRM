"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="size-11 object-contain rounded-xl mb-4" />
          <h1 className="text-base font-semibold text-ink tracking-tight">CRM</h1>
          <p className="text-sm text-ink-3 mt-1">Entre para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-white/[.07] p-6">
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-xs px-3 py-2.5 rounded-lg">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-ink-3 mb-2 uppercase tracking-wider">
                Usuário
              </label>
              <input
                name="username"
                required
                autoFocus
                autoComplete="username"
                className="w-full rounded-lg bg-raised border border-white/[.07] px-3 py-2.5 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-white/[.20] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-3 mb-2 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg bg-raised border border-white/[.07] px-3 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-white/[.20] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full mt-1 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-40 transition-colors"
            >
              {pending ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
