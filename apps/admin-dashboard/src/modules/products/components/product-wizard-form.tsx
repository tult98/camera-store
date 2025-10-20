import { Brand } from '@/modules/brands/types';
import { OrganizationVariantsStep } from '@/modules/products/components/wizard-steps/organization-variants-step';
import { ProductWithBrand } from '@/modules/products/types';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { WizardNavigation } from '../../shared/components/ui/wizard-navigation';
import { fetchProduct } from '../apiCalls/products';
import AttributeTemplateStep from './wizard-steps/attribute-template-step';
import { ProductBasicsStep } from './wizard-steps/product-basics-step';

interface ProductWizardFormProps {
  isEditMode?: boolean;
  productId?: string;
}

export const ProductWizardForm: React.FC<ProductWizardFormProps> = ({
  isEditMode = false,
  productId,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [product, setProduct] = useState<ProductWithBrand | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);

  const { data: fetchedProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: isEditMode && !!productId,
  });

  useEffect(() => {
    if (fetchedProduct?.product) {
      setProduct(fetchedProduct.product);
      setBrand(fetchedProduct?.product.brand || null);
    }
  }, [fetchedProduct]);

  const wizardSteps = [
    { label: 'Product Basics', completed: completedSteps.has(1) },
    { label: 'Attribute Template', completed: completedSteps.has(2) },
    { label: 'Organization & Variants', completed: completedSteps.has(3) },
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

  const onRedirectToProductList = () => {
    navigate('/products');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductBasicsStep
            isEditMode={isEditMode}
            productId={productId}
            initialData={product}
            onNext={handleNext}
            onBack={handleBack}
            currentStep={currentStep}
            setProduct={setProduct}
          />
        );
      case 2:
        return (
          <AttributeTemplateStep
            product={product}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <OrganizationVariantsStep
            product={product}
            brand={brand}
            onNext={onRedirectToProductList}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <LoadingIcon size="lg" />
      </div>
    );
  }

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
