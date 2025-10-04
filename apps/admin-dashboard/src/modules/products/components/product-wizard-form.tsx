import React, { useState } from 'react';
import { WizardNavigation } from '../../shared/components/ui/wizard-navigation';
import { AttributeTemplateStep } from './wizard-steps/attribute-template-step';
import { OptionsVariantsStep } from './wizard-steps/options-variants-step';
import { ProductBasicsStep } from './wizard-steps/product-basics-step';

interface ProductWizardFormProps {
  isEditMode?: boolean;
  productId?: string;
}

export const ProductWizardForm: React.FC<ProductWizardFormProps> = ({
  isEditMode = false,
}) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const wizardSteps = [
    { label: 'Product Basics', completed: completedSteps.has(1) },
    { label: 'Attribute Template', completed: completedSteps.has(2) },
    { label: 'Options & Variants', completed: completedSteps.has(3) },
  ];

  const handleNext = async () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (completedSteps.has(step) || step < currentStep) {
      setCurrentStep(step);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductBasicsStep
            isEditMode={isEditMode}
            onNext={handleNext}
            onBack={handleBack}
            currentStep={currentStep}
          />
        );
      case 2:
        return <AttributeTemplateStep />;
      case 3:
        return <OptionsVariantsStep />;
      default:
        return null;
    }
  };
  return (
    <div className="w-full">
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={3}
        steps={wizardSteps}
        onStepClick={handleStepClick}
        className="mb-8"
      />

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="p-6">{renderCurrentStep()}</div>
      </div>
    </div>
  );
};
