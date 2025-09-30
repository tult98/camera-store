import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserCircleIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  CommandLineIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { logoutUser } from '@modules/auth/apiCalls/logout';
import { useToast } from '@modules/shared/hooks/use-toast';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { error: showErrorToast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      showErrorToast('Logout failed', 'Unable to logout. Please try again.');
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: UserCircleIcon,
      label: 'Profile settings',
      action: () => {
        console.log('Profile settings clicked');
        onClose();
      },
    },
    {
      icon: BookOpenIcon,
      label: 'Documentation',
      action: () => {
        window.open('https://docs.medusajs.com', '_blank');
        onClose();
      },
    },
    {
      icon: ClipboardDocumentListIcon,
      label: 'Changelog',
      action: () => {
        console.log('Changelog clicked');
        onClose();
      },
    },
    {
      icon: CommandLineIcon,
      label: 'Shortcuts',
      action: () => {
        console.log('Shortcuts clicked');
        onClose();
      },
    },
    {
      icon: MoonIcon,
      label: 'Theme',
      hasSubmenu: true,
      action: () => {
        console.log('Theme clicked');
      },
    },
    {
      icon: ArrowRightOnRectangleIcon,
      label: logoutMutation.isPending ? 'Logging out...' : 'Log out',
      action: () => logoutMutation.mutate(),
      disabled: logoutMutation.isPending,
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          disabled={item.disabled}
          className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 text-left transition-colors ${
            item.disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
          {item.hasSubmenu && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
        </button>
      ))}
    </div>
  );
};