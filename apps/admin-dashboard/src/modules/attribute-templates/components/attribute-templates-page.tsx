import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionDropdown } from '../../shared/components/ui/action-dropdown';
import { ConfirmationModal } from '../../shared/components/ui/confirmation-modal';
import { DataTable } from '../../shared/components/ui/data-table';
import { useToast } from '../../shared/hooks/use-toast';
import {
  deleteAttributeTemplate,
  fetchAttributeTemplates,
} from '../apiCalls/attribute-templates';
import type {
  AttributeTemplate,
  AttributeTemplateDisplay,
} from '../types';

export const AttributeTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['attribute-templates'],
    queryFn: fetchAttributeTemplates,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttributeTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
      setDeleteModalOpen(false);
      success(
        'Template deleted',
        `"${templateToDelete?.name}" has been deleted successfully`
      );
      setTemplateToDelete(null);
    },
    onError: (err: Error) => {
      error(
        'Failed to delete template',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleDeleteClick = (template: AttributeTemplateDisplay) => {
    setTemplateToDelete({ id: template.id, name: template.name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      await deleteMutation.mutateAsync(templateToDelete.id);
    }
  };

  const transformTemplate = (
    template: AttributeTemplate
  ): AttributeTemplateDisplay => {
    return {
      id: template.id,
      name: template.name,
      status: template.is_active ? 'Active' : 'Inactive',
      attributeDefinitionsCount: template.attribute_definitions?.length || 0,
    };
  };

  const displayTemplates = templates.map(transformTemplate);

  const columns: ColumnDef<AttributeTemplateDisplay>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const isActive = status === 'Active';
        return (
          <div className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></span>
            <span className="text-gray-700">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'attributeDefinitionsCount',
      header: 'Attribute Definitions',
      cell: ({ getValue }) => (
        <span className="text-gray-700">{getValue() as number}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const template = row.original;

        return (
          <ActionDropdown
            actions={[
              {
                icon: PencilIcon,
                label: 'Edit',
                onClick: () =>
                  navigate(`/attribute-templates/${template.id}/edit`),
              },
              {
                icon: TrashIcon,
                label: 'Delete',
                variant: 'danger',
                onClick: () => handleDeleteClick(template),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Attribute Templates
        </h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => navigate('/attribute-templates/new')}
        >
          Add Template
        </button>
      </div>

      <DataTable
        data={displayTemplates}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No attribute templates found. Create your first template to get started."
        pageSize={10}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete template"
        description={`Are you sure you want to delete "${templateToDelete?.name}"? This action cannot be undone and may affect related products.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
