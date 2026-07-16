"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { recommendMatelas, type QuizAnswers } from "@/lib/quiz-algorithm";
import type { QuizStep } from "@/lib/quiz-defaults";

type Product = {
  _id: string;
  name?: string;
  title?: string;
  slug?: string;
  tagline?: string;
  type?: string;
  firmness?: string;
  minPrice?: number;
  compareAtPrice?: number;
  image?: any;
  featured?: boolean;
  variants?: { size?: string }[];
  rating?: { value?: number };
};

export function QuizWidget({
  steps,
  products,
}: {
  steps: QuizStep[];
  products: Product[];
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResult, setShowResult] = useState(false);

  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = ((stepIndex + (showResult ? 1 : 0)) / (totalSteps + 1)) * 100;

  const canProceed = useMemo(() => {
    if (!step) return false;
    const val = (answers as any)[step.key];
    if (step.type === "multi") return Array.isArray(val) && val.length > 0;
    if (step.type === "slider") return Array.isArray(val) && val.length === 2;
    return val !== undefined && val !== null && val !== "";
  }, [step, answers]);

  const isLastStep = stepIndex === totalSteps - 1;

  const handleAnswer = (value: any) => {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
    // Auto-advance sauf multi et slider (nécessitent bouton "Continuer")
    if (step.type === "single") {
      setTimeout(() => next(), 200);
    }
  };

  const toggleMulti = (value: string) => {
    if (!step || step.type !== "multi") return;
    const current = (answers as any)[step.key] || [];
    const next = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    setAnswers((prev) => ({ ...prev, [step.key]: next }));
  };

  const next = () => {
    if (isLastStep) {
      setShowResult(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const back = () => {
    if (showResult) {
      setShowResult(false);
    } else if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  const restart = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResult(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-sable">
        <div
          className="h-full bg-gradient-to-r from-or to-terracotta transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header controls */}
      <div className="mb-6 flex items-center justify-between text-sm">
        {(stepIndex > 0 || showResult) ? (
          <button type="button" onClick={back} className="flex items-center gap-1.5 font-medium text-ink hover:text-midnight">
            ‹ Retour
          </button>
        ) : <span />}
        <button type="button" onClick={restart} className="flex items-center gap-1.5 font-medium text-pierre hover:text-midnight">
          Redémarrer ↻
        </button>
      </div>

      {!showResult && step && (
        <div className="min-h-[400px]">
          <div className="text-center">
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {step.question}
            </h2>
            {step.subtitle && <p className="mt-2 text-sm text-pierre md:text-base">{step.subtitle}</p>}
          </div>

          <div className="mt-8">
            {step.type === "single" && <SingleChoice step={step} value={(answers as any)[step.key]} onSelect={handleAnswer} />}
            {step.type === "multi" && <MultiChoice step={step} values={(answers as any)[step.key] || []} onToggle={toggleMulti} />}
            {step.type === "slider" && <BudgetSlider step={step} value={(answers as any)[step.key]} onChange={handleAnswer} />}
          </div>

          {/* Bouton "Continuer" pour multi et slider */}
          {(step.type === "multi" || step.type === "slider") && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={next}
                disabled={!canProceed}
                className="inline-flex items-center gap-2 rounded-pill bg-midnight px-8 py-3.5 font-sora text-sm font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 md:text-base"
              >
                {isLastStep ? "Voir ma recommandation →" : "Continuer →"}
              </button>
            </div>
          )}
        </div>
      )}

      {showResult && <QuizResult answers={answers} products={products} onRestart={restart} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────────────────────

function SingleChoice({ step, value, onSelect }: { step: any; value?: string; onSelect: (v: string) => void }) {
  const hasImages = step.options.some((o: any) => o.imageUrl);
  const colClass = hasImages
    ? step.options.length <= 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-4"
    : step.options.length <= 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid gap-3 md:gap-4 ${colClass}`}>
      {step.options.map((opt: any) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`group flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all hover:-translate-y-1 ${
              isSelected
                ? "border-midnight shadow-[0_10px_30px_rgba(15,23,42,0.15)]"
                : "border-border bg-white hover:border-midnight"
            }`}
          >
            {opt.imageUrl && (
              <div className="relative aspect-square w-full overflow-hidden bg-sable">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${opt.imageUrl}?w=400&auto=format`}
                  alt={opt.imageAlt || opt.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div
              className={`flex flex-col items-center p-4 text-center ${
                isSelected ? "bg-midnight text-white" : "bg-white text-ink"
              } ${opt.imageUrl ? "" : "min-h-[110px] justify-center"}`}
            >
              <div className={`font-sora text-base font-semibold md:text-lg`}>
                {opt.label}
              </div>
              {opt.subtitle && (
                <div className={`mt-1 text-xs md:text-sm ${isSelected ? "text-white/80" : "text-pierre"}`}>
                  {opt.subtitle}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MultiChoice({ step, values, onToggle }: { step: any; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {step.options.map((opt: any) => {
        const isSelected = values.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`group flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
              isSelected ? "border-midnight bg-midnight/[0.04]" : "border-border bg-white hover:border-midnight"
            }`}
          >
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 transition-all ${
                isSelected ? "border-midnight bg-midnight text-white" : "border-border"
              }`}
            >
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span>
              <span className="block font-sora text-sm font-semibold text-ink md:text-base">{opt.label}</span>
              {opt.subtitle && <span className="mt-0.5 block text-xs text-pierre md:text-sm">{opt.subtitle}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BudgetSlider({ step, value, onChange }: { step: any; value?: [number, number]; onChange: (v: [number, number]) => void }) {
  const [min, max] = value || [step.min, step.max];
  return (
    <div className="mx-auto max-w-lg">
      <div className="text-center">
        <div className="text-sm text-pierre">Votre budget</div>
        <div className="mt-2 font-sora text-3xl font-bold text-ink md:text-4xl">
          {min.toLocaleString("fr-FR")} € <span className="text-pierre">–</span> {max.toLocaleString("fr-FR")} €
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 flex items-baseline justify-between text-sm text-pierre">
            <span>Minimum</span>
            <span className="font-semibold text-ink">{min} €</span>
          </span>
          <input
            type="range"
            min={step.min}
            max={step.max}
            step={step.step}
            value={min}
            onChange={(e) => onChange([Math.min(parseInt(e.target.value, 10), max), max])}
            className="w-full accent-midnight"
          />
        </label>
        <label className="block">
          <span className="mb-1 flex items-baseline justify-between text-sm text-pierre">
            <span>Maximum</span>
            <span className="font-semibold text-ink">{max} €</span>
          </span>
          <input
            type="range"
            min={step.min}
            max={step.max}
            step={step.step}
            value={max}
            onChange={(e) => onChange([min, Math.max(parseInt(e.target.value, 10), min)])}
            className="w-full accent-midnight"
          />
        </label>
      </div>
    </div>
  );
}

function QuizResult({ answers, products, onRestart }: { answers: QuizAnswers; products: Product[]; onRestart: () => void }) {
  const { best, alternatives } = useMemo(() => recommendMatelas(products, answers), [answers, products]);

  if (!best?.product) {
    return (
      <div className="rounded-3xl border border-border bg-sable p-8 text-center">
        <h3 className="font-sora text-xl font-semibold text-ink">Aucun matelas ne correspond exactement</h3>
        <p className="mt-2 text-pierre">Élargissez votre budget ou modifiez une préférence pour obtenir une reco.</p>
        <button type="button" onClick={onRestart} className="mt-4 rounded-pill bg-midnight px-6 py-2.5 text-sm font-semibold text-white">
          Refaire le quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="eyebrow mb-2 text-or">Votre recommandation</div>
        <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          D'après vos réponses, nous vous conseillons…
        </h2>
      </div>

      <ResultCard scored={best} highlighted />

      {alternatives.length > 0 && (
        <>
          <div className="mt-10 mb-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-brume">Vous aimerez peut-être aussi</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {alternatives.map((s) => <ResultCard key={s.product._id} scored={s} />)}
          </div>
        </>
      )}

      <div className="mt-10 text-center">
        <button type="button" onClick={onRestart} className="text-sm font-medium text-pierre underline decoration-dotted underline-offset-4 hover:text-midnight">
          Refaire le quiz
        </button>
      </div>
    </div>
  );
}

function ResultCard({ scored, highlighted = false }: { scored: any; highlighted?: boolean }) {
  const p = scored.product;
  const discount = p.compareAtPrice && p.minPrice ? Math.round(((p.compareAtPrice - p.minPrice) / p.compareAtPrice) * 100) : null;
  return (
    <article className={`overflow-hidden rounded-3xl border transition-all ${highlighted ? "border-midnight bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]" : "border-border bg-white"}`}>
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.5fr] md:gap-8 md:p-8">
        {p.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sable md:aspect-square">
            <Image
              src={urlFor(p.image).width(600).url()}
              alt={p.name || p.title || ""}
              fill
              sizes="(max-width:768px) 100vw, 40vw"
              className="object-cover"
            />
            {discount && discount > 0 && (
              <span className="absolute left-3 top-3 rounded bg-discount px-2 py-1 text-xs font-bold uppercase text-white">
                -{discount}%
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">{p.title || p.name}</h3>
          {p.tagline && <p className="mt-2 text-sm text-pierre md:text-base">{p.tagline}</p>}

          {scored.reasons.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-pierre md:text-base">
              {scored.reasons.slice(0, 3).map((r: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden className="mt-0.5 text-vert-menthe">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex items-baseline gap-3 border-t border-border pt-4">
            <span className="font-sora text-2xl font-bold text-discount md:text-3xl">{p.minPrice} €</span>
            {p.compareAtPrice && p.compareAtPrice > (p.minPrice || 0) && (
              <span className="text-base text-brume line-through">{p.compareAtPrice} €</span>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/matelas/${p.slug}`}
              className="inline-flex flex-1 items-center justify-center rounded-pill bg-midnight px-6 py-3 font-sora text-sm font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px md:text-base"
            >
              Acheter maintenant →
            </Link>
            <Link
              href={`/matelas/${p.slug}`}
              className="inline-flex flex-1 items-center justify-center rounded-pill border border-border bg-white px-6 py-3 font-sora text-sm font-semibold text-ink transition-all hover:border-midnight md:text-base"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
