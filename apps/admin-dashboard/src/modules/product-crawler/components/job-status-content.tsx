import React from 'react';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import type { JobStatusResponse } from '../types/crawler.types';
import { JobStateMessage } from './job-state-message';
import { ProductCreationForm } from './product-creation-form';

interface JobStatusContentProps {
  jobStatus: JobStatusResponse | undefined;
  isLoadingStatus: boolean;
}

export const JobStatusContent: React.FC<JobStatusContentProps> = ({
  jobStatus,
  isLoadingStatus,
}) => {
  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingIcon size="xl" color="blue" />
      </div>
    );
  }

  if (!jobStatus) {
    return null;
  }

  switch (jobStatus.state) {
    case 'failed':
      return jobStatus.failedReason ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium mb-1">
            Failure Reason:
          </p>
          <p className="text-sm text-red-700">{jobStatus.failedReason}</p>
        </div>
      ) : null;

    case 'completed':
      return jobStatus.result?.productData ? (
        <ProductCreationForm productData={jobStatus.result.productData} />
      ) : null;

    case 'waiting':
      return (
        <JobStateMessage
          variant="yellow"
          message="Job is waiting in queue..."
        />
      );

    case 'active':
      return (
        <JobStateMessage
          variant="blue"
          message="Crawling product data... (auto-refreshing every 2s)"
          showIcon
        />
      );

    case 'delayed':
      return (
        <JobStateMessage
          variant="purple"
          message="Job is scheduled to run later..."
        />
      );

    case 'waiting-children':
      return (
        <JobStateMessage
          variant="orange"
          message="Job is waiting for dependencies to complete..."
        />
      );

    case 'prioritized':
      return (
        <JobStateMessage
          variant="indigo"
          message="Job is prioritized in queue... (auto-refreshing every 2s)"
          showIcon
        />
      );

    case 'unknown':
      return (
        <JobStateMessage
          variant="gray"
          message="Unable to determine job status. The job may have been removed or is in an unexpected state."
        />
      );

    default:
      return null;
  }
};
