"use client";

import { cn } from "@/lib/cn";

interface SellStepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { num: 1, label: "Datos" },
  { num: 2, label: "Documentos" },
  { num: 3, label: "Confirmación" },
];

/** Stepper de 3 pasos para flujo vendedor. */
export function SellStepper({ currentStep }: SellStepperProps) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const completed = step.num < currentStep;
        const active = step.num === currentStep;

        return (
          <div key={step.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition",
                  completed && "bg-texo-success text-white",
                  active && !completed && "bg-texo-primary text-white",
                  !active && !completed &&
                    "border border-texo-border bg-texo-surface text-texo-text-muted",
                )}
              >
                {completed ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  active || completed ? "text-texo-primary" : "text-texo-text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  step.num < currentStep ? "bg-texo-primary" : "bg-texo-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
