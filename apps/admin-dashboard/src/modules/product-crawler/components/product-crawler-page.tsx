import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormInput } from '../../shared/components/ui/form-input';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { crawlProduct, getJobStatus } from '../apiCalls/crawler';
import type { JobStatusResponse } from '../types/crawler.types';
import { JobStatusCard } from './job-status-card';

const crawlerFormSchema = z.object({
  url: z
    .string()
    .min(1, 'Product URL is required')
    .url('Must be a valid URL')
    .refine(
      (url) => url.includes('bhphotovideo.com'),
      'URL must be from bhphotovideo.com'
    ),
});

type CrawlerFormData = z.infer<typeof crawlerFormSchema>;

export const ProductCrawlerPage: React.FC = () => {
  const [jobId, setJobId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CrawlerFormData>({
    resolver: zodResolver(crawlerFormSchema),
    mode: 'onBlur',
    defaultValues: {
      url: '',
    },
  });

  const crawlMutation = useMutation({
    mutationFn: crawlProduct,
  });

  const { data: jobStatus, isLoading: isLoadingStatus } =
    useQuery<JobStatusResponse>({
      queryKey: ['job', jobId],
      queryFn: () => {
        if (!jobId) throw new Error('Job ID is required');
        return getJobStatus(jobId);
      },
      refetchInterval: (query) => {
        const data = query.state.data;
        if (
          data?.state === 'completed' ||
          data?.state === 'failed' ||
          data?.state === 'unknown'
        ) {
          return false;
        }
        return 2000;
      },
      enabled: !!jobId,
    });

  const handleFormSubmit = async (data: CrawlerFormData) => {
    crawlMutation.mutate(data.url, {
      onSuccess: (response) => {
        setJobId(response.jobId);
        reset();
      },
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Crawler</h1>
          <p className="text-sm text-gray-600 mt-1">
            Crawl product information from B&H Photo Video
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormInput
            name="url"
            control={control}
            type="url"
            label="Product URL"
            placeholder="https://www.bhphotovideo.com/c/product/..."
            disabled={isSubmitting || crawlMutation.isPending}
            required={true}
          />
          <p className="text-xs text-gray-500 -mt-2">
            Enter a product URL from bhphotovideo.com
          </p>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={crawlMutation.isPending || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {crawlMutation.isPending && (
                <LoadingIcon size="md" color="white" />
              )}
              Start Crawl
            </button>
          </div>

          {crawlMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Error:{' '}
                {(crawlMutation.error as Error)?.message ||
                  'Failed to submit crawl job'}
              </p>
            </div>
          )}

          {crawlMutation.isSuccess && jobId && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-1">
                Crawl job submitted successfully!
              </p>
              <p className="text-xs text-green-700 font-mono">
                Job ID: {jobId}
              </p>
            </div>
          )}
        </form>
      </div>

      {jobId && (
        <JobStatusCard
          jobStatus={jobStatus}
          isLoadingStatus={isLoadingStatus}
        />
      )}
    </div>
  );
};
