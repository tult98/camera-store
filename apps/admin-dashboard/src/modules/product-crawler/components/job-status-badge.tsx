import React from 'react';
import type { JobStatusResponse } from '../types/crawler.types';

interface JobStatusBadgeProps {
  state: JobStatusResponse['state'];
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ state }) => {
  const getStatusClasses = () => {
    switch (state) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800 animate-pulse';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-purple-100 text-purple-800';
      case 'waiting-children':
        return 'bg-orange-100 text-orange-800';
      case 'prioritized':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    if (state === 'waiting-children') {
      return 'Waiting Children';
    }
    return state.charAt(0).toUpperCase() + state.slice(1);
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses()}`}
    >
      {getStatusLabel()}
    </span>
  );
};
