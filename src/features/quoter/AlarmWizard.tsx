"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui";
import { formatArs } from "@/lib/pricing";
import { ProgressBar, OptionCard, PillOption, StepTitle } from "./components/parts";
import { SolutionResult } from "./components/SolutionResult";
import { buildAlarmSolution } from "./alarm-logic";
import { emptyAlarmAnswers, type AlarmAnswers, type QuoterDataset } from "./types";

const TARGETS = [
  { key: "casa", label: "Casa", icon: "home" as const },
  { key: "comercio", label: "Comercio", icon: "shield" as const },
  { key: "oficina", label: "Oficina", icon: "wifi" as const },
  { key: "galpon", label: "Galpón", icon: "camera" as const },
];
const OPENINGS = [1, 2, 3, 4, 5, 6];
const CAMERAS = [0, 1, 2, 4, 6];
const AUTOMATION = [
  { key: "porton", label: "Portón" },
  { key: "luces", label: "Luces" },
  { key: "cerradura", label: "Cerradura" },
];

const TOTAL_STEPS = 5;

export function AlarmWizard({
  dataset,
  initialTarget,
}: {
  dataset: QuoterDataset;
  initialTarget?: string;
}) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AlarmAnswers>({
    ...emptyAlarmAnswers,
    target: (TARGETS.find((t) => t.key === initialTarget)?.key as
      | AlarmAnswers["target"]
      | undefined) ?? null,
  });
  const [finished, setFinished] = useState(false);

  const solution = useMemo(
    () => buildAlarmSolution(answers, dataset),
    [answers, dataset]
  );

  const set = (patch: Partial<AlarmAnswers>) =>
    setAnswers((a) => ({ ...a, ...patch }));

  const toggleAutomation = (key: "porton" | "luces" | "cerradura") =>
    setAnswers((a) => ({
      ...a,
      automation: a.automation.includes(key)
        ? a.automation.filter((x) => x !== key)
        : [...a.automation, key],
    }));

  const canNext =
    (step === 1 && answers.target) ||
    (step === 2 && answers.openings) ||
    (step === 3 && answers.wantsMovement !== null) ||
    (step === 4 && answers.cameras !== null) ||
    step === 5;

  if (finished) {
    return (
      <div>
        <button
          onClick={() => setFinished(false)}
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
        >
          ← Modificar respuestas
        </button>
        <SolutionResult
          solution={solution}
          paymentMethods={dataset.paymentMethods}
          source="cotizador-alarmas"
          serviceLabel="Alarma"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ProgressBar step={step} total={TOTAL_STEPS} />

        <div className="mt-8 min-h-[320px]">
          {step === 1 && (
            <div className="animate-fade-in-up">
              <StepTitle>¿Qué querés proteger?</StepTitle>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TARGETS.map((t) => (
                  <OptionCard
                    key={t.key}
                    selected={answers.target === t.key}
                    onClick={() => set({ target: t.key as AlarmAnswers["target"] })}
                    icon={<Icon name={t.icon} />}
                    title={t.label}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <StepTitle>¿Cuántas puertas/ventanas querés proteger?</StepTitle>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {OPENINGS.map((n) => (
                  <PillOption
                    key={n}
                    selected={answers.openings === n}
                    onClick={() => set({ openings: n })}
                  >
                    {n === 6 ? "6+" : n}
                  </PillOption>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <StepTitle>¿Querés detectar movimiento?</StepTitle>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <OptionCard
                  selected={answers.wantsMovement === true}
                  onClick={() => set({ wantsMovement: true })}
                  title="Sí"
                  subtitle="Sumamos sensor de presencia"
                />
                <OptionCard
                  selected={answers.wantsMovement === false}
                  onClick={() => set({ wantsMovement: false })}
                  title="No"
                  subtitle="Solo aberturas"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up">
              <StepTitle>¿Querés cámaras?</StepTitle>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {CAMERAS.map((n) => (
                  <PillOption
                    key={n}
                    selected={answers.cameras === n}
                    onClick={() => set({ cameras: n })}
                  >
                    {n === 0 ? "No" : n === 6 ? "6+" : n}
                  </PillOption>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">
                Las cámaras se cotizan aparte en el cotizador de cámaras.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in-up">
              <StepTitle>¿Querés automatizar algo?</StepTitle>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {AUTOMATION.map((a) => (
                  <OptionCard
                    key={a.key}
                    selected={answers.automation.includes(a.key as "porton")}
                    onClick={() =>
                      toggleAutomation(a.key as "porton" | "luces" | "cerradura")
                    }
                    title={a.label}
                  />
                ))}
                <OptionCard
                  selected={answers.automation.length === 0}
                  onClick={() => set({ automation: [] })}
                  title="Nada"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Atrás
          </Button>
          {step < TOTAL_STEPS ? (
            <Button
              variant="accent"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
            >
              Continuar <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="accent" onClick={() => setFinished(true)}>
              Ver mi solución <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Resumen en tiempo real (lateral desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="text-sm font-semibold text-ink">Tu solución</div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {solution.lines.slice(0, 8).map((l, i) => (
              <li key={i} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 flex-none text-accent" />
                <span>
                  {l.quantity > 1 && `${l.quantity}× `}
                  {l.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-line pt-4">
            <div className="text-xs text-muted">Precio estimado</div>
            <div className="text-2xl font-bold text-ink">
              {formatArs(solution.saleTotal)}
            </div>
          </div>
        </div>
      </aside>

      {/* Resumen inferior (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <div className="text-xs text-muted">Precio estimado</div>
            <div className="text-lg font-bold text-ink">
              {formatArs(solution.saleTotal)}
            </div>
          </div>
          {step < TOTAL_STEPS ? (
            <Button variant="accent" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Continuar
            </Button>
          ) : (
            <Button variant="accent" onClick={() => setFinished(true)}>
              Ver solución
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
