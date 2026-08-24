"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { LineIcon } from "./line-icon";

/**
 * Chatbot conseiller sommeil DreamsFly.
 * Bulle flottante en bas à droite (noir + or), panneau éditorial luxe.
 * - Streaming des réponses via /api/chat (Anthropic API côté serveur).
 * - Historique en localStorage (persiste entre visites, reset via bouton).
 * - Sans emoji. Design cohérent avec la direction A.
 *
 * Requiert ANTHROPIC_API_KEY côté Vercel (voir /app/api/chat/route.ts).
 * Si la clé n'est pas configurée, le widget affiche un état "prochainement"
 * gracieux (le back renvoie une 503 explicite).
 */

const LS_KEY = "df:chat-history";
const MAX_HISTORY = 24;

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Bonjour, je suis votre conseiller sommeil DreamsFly. Dites-moi ce que vous cherchez — un matelas pour le dos, un couchage adapté à votre morphologie, ou une simple question sur nos technologies.",
};

const SUGGESTED = [
  "Un matelas pour le mal de dos",
  "Différence mémoire de forme et ressorts ?",
  "Un modèle pour deux personnes",
  "Où essayer en showroom ?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore history at mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch {}
  }, [messages]);

  // Autoscroll
  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open]);

  // Lock body scroll on mobile
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function send(userText?: string) {
    const text = (userText ?? input).trim();
    if (!text || busy) return;

    setError(null);
    setInput("");
    const nextMessages: Msg[] = [...messages, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMessages(nextMessages);
    setBusy(true);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const historyForServer = nextMessages
        .slice(0, -1) // sans le placeholder assistant vide
        .filter((m) => m.content) // évite l'éventuel WELCOME initial vide
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        signal: ac.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForServer }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur réseau" }));
        setError(err?.error || `Erreur ${res.status}`);
        // Retire le placeholder assistant vide
        setMessages((prev) => prev.slice(0, -1));
        setBusy(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Pas de flux à lire");

      let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) => {
          const copy = prev.slice(0, -1);
          copy.push({ role: "assistant", content: full });
          return copy;
        });
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError(err?.message || "Erreur inattendue.");
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setInput("");
    setError(null);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }

  const isFirstConversation = useMemo(
    () => messages.length <= 1 && messages[0]?.role === "assistant",
    [messages],
  );

  return (
    <>
      {/* Bulle flottante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le conseiller sommeil"
          className="group fixed bottom-6 right-6 z-[190] flex h-16 w-16 items-center justify-center rounded-full bg-noir text-or shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all hover:scale-105 hover:bg-ink md:bottom-8 md:right-8"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-or/40 transition-all group-hover:scale-110" aria-hidden="true" />
          <span className="pointer-events-none absolute -inset-2 rounded-full border border-or/20 opacity-0 transition-all group-hover:opacity-100" aria-hidden="true" />
          <LineIcon name="chat" size={26} strokeWidth={1.3} />
        </button>
      )}

      {/* Panneau */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-[190] flex h-[85vh] flex-col rounded-t-[28px] border border-white/10 bg-page shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.5)] md:inset-auto md:bottom-8 md:right-8 md:h-[640px] md:w-[440px] md:rounded-[28px]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-4 border-b border-ink/10 bg-noir px-6 py-5 text-ivoire md:rounded-t-[28px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-or/40 bg-noir-doux text-or">
                <LineIcon name="chat" size={20} strokeWidth={1.3} />
              </div>
              <div>
                <div className="font-serif text-[17px] font-normal leading-tight">Conseiller sommeil</div>
                <div className="mt-0.5 font-sans text-[10.5px] uppercase tracking-[0.18em] text-or">
                  Assistant IA · DreamsFly
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                aria-label="Nouvelle conversation"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ivoire/60 transition-colors hover:bg-white/10 hover:text-or"
                title="Nouvelle conversation"
              >
                <LineIcon name="sparkle" size={16} strokeWidth={1.4} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ivoire/60 transition-colors hover:bg-white/10 hover:text-ivoire"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </div>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-[20px] px-4 py-3 font-sans text-[14px] leading-relaxed md:text-[14.5px] ${
                    m.role === "user"
                      ? "rounded-br-md bg-noir text-ivoire"
                      : "rounded-bl-md bg-ivoire text-ink border border-ink/10"
                  }`}
                >
                  {m.content ? formatContent(m.content) : (
                    <span className="inline-flex items-center gap-2 text-taupe">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-or" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-or" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-or" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="mx-auto max-w-[85%] rounded-[16px] border border-error/30 bg-error/5 px-4 py-3 font-sans text-[13px] leading-relaxed text-error">
                {error}
              </div>
            )}

            {isFirstConversation && !busy && (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3 px-1">
                  <span className="h-px w-6 bg-or" aria-hidden="true" />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-taupe">
                    Ou choisissez une suggestion
                  </span>
                </div>
                <ul className="space-y-2">
                  {SUGGESTED.map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => send(s)}
                        className="group flex w-full items-center justify-between gap-3 rounded-[14px] border border-ink/10 bg-ivoire px-4 py-3 text-left font-serif text-[15px] italic text-ink transition-all hover:border-noir/40 hover:bg-creme"
                      >
                        <span>{s}</span>
                        <LineIcon name="arrow" size={14} className="text-taupe opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="border-t border-ink/10 bg-ivoire px-4 py-3 md:rounded-b-[28px]"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Posez votre question…"
                rows={1}
                disabled={busy}
                className="flex-1 resize-none bg-transparent px-2 py-3 font-serif text-[15px] italic text-ink outline-none placeholder:text-taupe/70 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Envoyer"
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-noir text-or transition-all hover:bg-ink disabled:opacity-40"
              >
                <LineIcon name="arrow" size={18} strokeWidth={1.4} />
              </button>
            </div>
            <p className="mt-1 px-2 font-sans text-[10px] uppercase tracking-[0.14em] text-taupe">
              Entrée pour envoyer · Maj+Entrée pour un saut de ligne
            </p>
          </form>
        </div>
      )}
    </>
  );
}

/** Convertit un texte de réponse en JSX avec liens cliquables sur les URLs internes. */
function formatContent(text: string): React.ReactNode {
  const parts = text.split(/(\/[a-z0-9\-/]+)/gi);
  return parts.map((p, i) => {
    if (/^\/[a-z0-9\-/]+$/i.test(p)) {
      return (
        <a
          key={i}
          href={p}
          className="font-medium text-noir underline decoration-or decoration-2 underline-offset-2 hover:text-or"
        >
          {p}
        </a>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
