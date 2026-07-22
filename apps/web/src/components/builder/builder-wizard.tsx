'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore, type StepId } from '@/store/builder';
import { cn } from '@/lib/utils';
import { ProjectStep } from './steps/project-step';
import { EnclosureStep } from './steps/enclosure-step';
import { CircuitsStep } from './steps/circuits-step';
import { ComponentsStep } from './steps/components-step';
import { ReviewStep } from './steps/review-step';
import { PricingSidebar } from './pricing-sidebar';

const STEPS: { id: StepId; label: string; shortLabel: string }[] = [
  { id: 'PROJECT', label: 'Projeto', shortLabel: 'Projeto' },
  { id: 'ENCLOSURE', label: 'Invólucro', shortLabel: 'Invólucro' },
  { id: 'CIRCUITS', label: 'Circuitos', shortLabel: 'Circuitos' },
  { id: 'COMPONENTS', label: 'Componentes', shortLabel: 'Componentes' },
  { id: 'REVIEW', label: 'Revisão', shortLabel: 'Revisão' },
];

const STEP_VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export function BuilderWizard() {
  const { currentStep, setStep, placements, project } = useBuilderStore();
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
  const direction = 1;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">CPQ</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">
            {project.name || 'Novo Painel'}
          </span>
        </div>

        {/* Step Indicator */}
        <nav className="flex items-center gap-1">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentIdx;
            const isCompleted = idx < currentIdx;
            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={cn(
                  'relative flex h-8 items-center rounded-full px-3 text-xs font-medium transition-all duration-200 ease-out',
                  isActive && 'bg-primary text-primary-foreground',
                  !isActive && !isCompleted && 'text-muted-foreground hover:text-foreground',
                  isCompleted && 'text-primary hover:bg-secondary',
                )}
              >
                <span
                  className={cn(
                    'mr-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                    isActive && 'bg-primary-foreground/20',
                    !isActive && 'bg-secondary',
                    isCompleted && 'bg-primary text-primary-foreground',
                  )}
                >
                  {isCompleted ? '✓' : idx + 1}
                </span>
                <span className="hidden sm:inline">{step.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        <div className="w-32" />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Step Content */}
        <main className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={STEP_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
              className="absolute inset-0 p-8"
            >
              {currentStep === 'PROJECT' && <ProjectStep />}
              {currentStep === 'ENCLOSURE' && <EnclosureStep />}
              {currentStep === 'CIRCUITS' && <CircuitsStep />}
              {currentStep === 'COMPONENTS' && <ComponentsStep />}
              {currentStep === 'REVIEW' && <ReviewStep />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Pricing Sidebar */}
        <PricingSidebar />
      </div>
    </div>
  );
}
