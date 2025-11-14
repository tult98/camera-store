import React from 'react';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';

interface JobStateMessageProps {
  variant: 'yellow' | 'blue' | 'purple' | 'orange' | 'indigo' | 'gray' | 'red';
  message: string;
  showIcon?: boolean;
}

export const JobStateMessage: React.FC<JobStateMessageProps> = ({
  variant,
  message,
  showIcon = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'yellow':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
        };
      case 'blue':
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
        };
      case 'purple':
        return {
          container: 'bg-purple-50 border-purple-200',
          text: 'text-purple-800',
        };
      case 'orange':
        return {
          container: 'bg-orange-50 border-orange-200',
          text: 'text-orange-800',
        };
      case 'indigo':
        return {
          container: 'bg-indigo-50 border-indigo-200',
          text: 'text-indigo-800',
        };
      case 'gray':
        return {
          container: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
        };
      case 'red':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-800',
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className={`p-4 ${classes.container} border rounded-lg`}>
      <p className={`text-sm ${classes.text} flex items-center gap-2`}>
        {showIcon && <LoadingIcon size="sm" color="blue" />}
        {message}
      </p>
    </div>
  );
};
