import { Brand } from '@/modules/brands/types';
import { OrganizationVariantsStep } from '@/modules/products/components/wizard-steps/organization-variants-step';
import { ProductWithBrand } from '@/modules/products/types';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { TabNavigation } from '../../shared/components/ui/tab-navigation';
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
  const [currentTab, setCurrentTab] = useState(1);
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

  const tabs = [
    {
      label: 'Product Basics',
      disabled: false
    },
    {
      label: 'Attribute Template',
      disabled: !isEditMode && !product
    },
    {
      label: 'Organization & Variants',
      disabled: !isEditMode && !product
    },
  ];

  const handleNext = async () => {
    if (currentTab < 3) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handleTabClick = (tab: number) => {
    setCurrentTab(tab);
  };

  const onRedirectToProductList = () => {
    navigate('/products');
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 1:
        return (
          <ProductBasicsStep
            isEditMode={isEditMode}
            productId={productId}
            initialData={product}
            onNext={handleNext}
            setProduct={setProduct}
          />
        );
      case 2:
        return (
          <AttributeTemplateStep
            product={product}
            onNext={handleNext}
            isEditMode={isEditMode}
          />
        );
      case 3:
        return (
          <OrganizationVariantsStep
            product={product}
            brand={brand}
            onNext={onRedirectToProductList}
            isEditMode={isEditMode}
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
      <TabNavigation
        currentTab={currentTab}
        totalTabs={3}
        tabs={tabs}
        onTabClick={handleTabClick}
        className="mb-8"
      />

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="p-6">{renderCurrentTab()}</div>
      </div>
    </div>
  );
};
