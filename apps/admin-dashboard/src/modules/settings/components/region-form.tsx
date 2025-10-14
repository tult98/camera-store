import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../shared/components/ui/form-input';
import {
  FormSelect,
  SelectOption,
} from '../../shared/components/ui/form-input/form-select';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import {
  createRegion,
  fetchCurrencies,
  fetchPaymentProviders,
  updateRegion,
} from '../apiCalls/regions';
import { regionSchema, type RegionSchemaType } from '../types';

const COMMON_COUNTRIES: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'be', label: 'Belgium' },
  { value: 'pl', label: 'Poland' },
  { value: 'se', label: 'Sweden' },
  { value: 'dk', label: 'Denmark' },
  { value: 'fi', label: 'Finland' },
  { value: 'no', label: 'Norway' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
  { value: 'ph', label: 'Philippines' },
  { value: 'sg', label: 'Singapore' },
  { value: 'th', label: 'Thailand' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'id', label: 'Indonesia' },
  { value: 'my', label: 'Malaysia' },
];

interface RegionFormProps {
  initialData?: RegionSchemaType;
  isEditMode?: boolean;
  regionId?: string;
}

export const RegionForm: React.FC<RegionFormProps> = ({
  initialData,
  isEditMode = false,
  regionId,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { isSubmitting },
  } = useForm<RegionSchemaType>({
    resolver: zodResolver(regionSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      currency_code: '',
      countries: [],
      payment_providers: [],
    },
  });

  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const { data: currencies = [], isLoading: isCurrenciesLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
  });

  const { data: paymentProviders = [], isLoading: isPaymentProvidersLoading } =
    useQuery({
      queryKey: ['payment-providers'],
      queryFn: fetchPaymentProviders,
    });

  const currencyOptions: SelectOption[] = useMemo(
    () =>
      currencies.map((currency) => ({
        value: currency.code,
        label: `${currency.code.toUpperCase()} - ${currency.name}`,
      })),
    [currencies]
  );

  const paymentProviderOptions: SelectOption[] = useMemo(
    () =>
      paymentProviders.map((provider) => ({
        value: provider.id,
        label: provider.id
          .replace(/^pp_/, '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      })),
    [paymentProviders]
  );

  const createRegionMutation = useMutation({
    mutationFn: createRegion,
    onSuccess: (newRegion) => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });

      success(
        'Region created',
        `"${newRegion.name}" has been created successfully`
      );

      reset();
      navigate('/settings/regions');
    },
    onError: (err: Error) => {
      error(
        'Failed to create region',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const updateRegionMutation = useMutation({
    mutationFn: (data: RegionSchemaType) => updateRegion(regionId!, data),
    onSuccess: (updatedRegion) => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      queryClient.invalidateQueries({ queryKey: ['region', regionId] });

      success(
        'Region updated',
        `"${updatedRegion.name}" has been updated successfully`
      );
    },
    onError: (err: Error) => {
      error(
        'Failed to update region',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleFormSubmit = async (data: RegionSchemaType) => {
    const isValid = await trigger();

    if (isValid) {
      if (isEditMode) {
        updateRegionMutation.mutate(data);
      } else {
        createRegionMutation.mutate(data);
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput
        name="name"
        control={control}
        type="text"
        label="Region Name"
        placeholder="e.g., North America, Europe"
        disabled={
          isSubmitting ||
          createRegionMutation.isPending ||
          updateRegionMutation.isPending
        }
        required={true}
      />

      <FormSelect
        name="currency_code"
        control={control}
        options={currencyOptions}
        label="Currency Code"
        placeholder={
          isCurrenciesLoading ? 'Loading currencies...' : 'Select a currency'
        }
        disabled={
          isSubmitting ||
          createRegionMutation.isPending ||
          updateRegionMutation.isPending ||
          isCurrenciesLoading
        }
        required={true}
        isClearable={true}
      />

      <FormSelect
        name="countries"
        control={control}
        options={COMMON_COUNTRIES}
        label="Countries"
        placeholder="Select countries for this region"
        disabled={
          isSubmitting ||
          createRegionMutation.isPending ||
          updateRegionMutation.isPending
        }
        isMulti={true}
        isClearable={true}
      />

      <FormSelect
        name="payment_providers"
        control={control}
        options={paymentProviderOptions}
        label="Payment Providers"
        placeholder={
          isPaymentProvidersLoading
            ? 'Loading payment providers...'
            : 'Select payment providers'
        }
        disabled={
          isSubmitting ||
          createRegionMutation.isPending ||
          updateRegionMutation.isPending ||
          isPaymentProvidersLoading
        }
        isMulti={true}
        isClearable={true}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => navigate('/settings/regions')}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={
            isSubmitting ||
            createRegionMutation.isPending ||
            updateRegionMutation.isPending
          }
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            createRegionMutation.isPending ||
            updateRegionMutation.isPending
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {(isSubmitting ||
            createRegionMutation.isPending ||
            updateRegionMutation.isPending) && (
            <LoadingIcon size="md" color="white" className="mr-2" />
          )}
          {isEditMode ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
