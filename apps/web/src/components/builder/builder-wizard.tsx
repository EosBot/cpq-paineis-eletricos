'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';
import { cn } from '@/lib/utils';
import { ProjectStep } from './steps/project-step';
import { EnclosureStep } from './steps/enclosure-step';
import { CircuitsStep } from './steps/circuits-step';
import { ComponentsStep } from './steps/components-step';
import { ReviewStep } from './steps/review-step';
import { PricingSidebar } from './pricing-sidebar';

const STEPS = [
  { id: 'PROJECT', label: 'Projeto', shortLabel: 'Projeto', icon: '📋' },
  { id: 'ENCLOSURE', label: 'Invólucro', shortLabel: 'Invól.', icon: '📦' },
  { id: 'CIRCUITS', label: 'Circuitos', shortLabel: 'Circuitos', icon: '⚡' },
  { id: 'COMPONENTS', label: 'Componentes', shortLabel: 'Comp.', icon: '🔌' },
  { id: 'REVIEW', label: 'Revisão', shortLabel: 'Revisão', icon: '✅' },
];

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

export function BuilderWizard() {
  const { currentStep, project } = useBuilderStore();
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0f]/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">CPQ Painéis</span>
          <span className="text-white/20">|</span>
          <span className="text-sm text-white/60">{project.name || 'Novo Painel'}</span>
        </div>

        {/* Step Indicator */}
        <nav className="flex items-center gap-1">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentIdx;
            const isCompleted = idx < currentIdx;
            return (
              <button
                key={step.id}
                className={cn(
                  'relative flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium transition-all duration-300',
                  isActive && 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10',
                  !isActive && !isCompleted && 'text-white/30 hover:text-white/50',
                  isCompleted && 'text-emerald-400',
                )}
              >
                <span className="text-sm">{step.icon}</span>
                <span className="hidden sm:inline">{step.shortLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute inset-0 rounded-full border border-blue-500/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
