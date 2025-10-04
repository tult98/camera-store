import { cn } from '@modules/shared/utils/cn';
import React from 'react';

interface WizardStep {
  label: string;
  completed?: boolean;
}

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  steps: WizardStep[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
  className = '',
}) => {
  const handleStepClick = (stepNumber: number) => {
    if (onStepClick && stepNumber < currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className={cn('w-full py-6', className)}>
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const step = steps[index];
          const isActive = stepNumber === currentStep;
          const isCompleted = step?.completed || stepNumber < currentStep;
          const isClickable = stepNumber < currentStep && onStepClick;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    {
                      'bg-blue-600 text-white': isActive,
                      'bg-green-500 text-white': isCompleted && !isActive,
                      'border-2 border-gray-300 text-gray-500 bg-white':
                        !isActive && !isCompleted,
                      'cursor-pointer hover:border-gray-400': isClickable,
                      'cursor-default': !isClickable,
                    }
                  )}
                  aria-label={`Step ${stepNumber}: ${step?.label || ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted && !isActive ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>

                {step?.label && (
                  <span
                    className={cn('mt-2 text-xs text-center max-w-20', {
                      'text-blue-600 font-medium': isActive,
                      'text-green-600': isCompleted && !isActive,
                      'text-gray-500': !isActive && !isCompleted,
                    })}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {stepNumber < totalSteps && (
                <div
                  className={cn('flex-1 h-px mx-4 transition-colors', {
                    'bg-green-500': stepNumber < currentStep,
                    'bg-gray-300': stepNumber >= currentStep,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
