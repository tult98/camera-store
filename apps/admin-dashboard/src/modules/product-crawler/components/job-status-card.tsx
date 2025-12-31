import React from 'react';
import type { JobStatusResponse } from '../types/crawler.types';
import { JobStatusBadge } from './job-status-badge';
import { JobStatusContent } from './job-status-content';

interface JobStatusCardProps {
  jobStatus: JobStatusResponse | undefined;
  isLoadingStatus: boolean;
}

export const JobStatusCard: React.FC<JobStatusCardProps> = ({ jobStatus, isLoadingStatus }) => {
  return (
    <div className="bg-white rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Job Status</h2>
        {jobStatus && <JobStatusBadge state={jobStatus.state} />}
      </div>

      <JobStatusContent jobStatus={jobStatus} isLoadingStatus={isLoadingStatus} />
    </div>
  );
};
