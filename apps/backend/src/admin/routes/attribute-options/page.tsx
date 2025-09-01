import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Plus } from "@medusajs/icons";
import { Button, Container, Heading, Toaster, toast } from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { withQueryClientProvider } from "../../utils/query-client";
import { AttributeFormSection } from "./components/AttributeFormSection";

type AttributeFormData = {
  group_name: string;
  options: string[];
};

type FormData = {
  attributes: AttributeFormData[];
};

type AttributeGroup = {
  id: string;
  group_name: string;
  options: string[];
  created_at: string;
  updated_at: string;
};

const fetchAttributeGroups = async (): Promise<AttributeGroup[]> => {
  const response = await fetch("/admin/attribute-options");
  if (!response.ok) {
    throw new Error("Failed to fetch attribute groups");
  }
  const data = await response.json();
  return data.attribute_groups || [];
};

const AttributeOptionsListCore = () => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const { data: groups = [], isLoading } = useQuery<AttributeGroup[]>({
    queryKey: ["attribute-groups"],
    queryFn: fetchAttributeGroups,
  });

  useEffect(() => {
    if (groups.length > 0) {
      const attributes = groups.map((group) => ({
        group_name: group.group_name,
        options: group.options,
      }));

      reset({ attributes });
    }
  }, [groups, reset]);

  const deleteAttributeMutation = useMutation({
    mutationFn: async (groupName: string) => {
      // Find the group by name to get its ID
      const groupToDelete = groups.find(
        g => g.group_name.toLowerCase() === groupName.toLowerCase()
      );
      
      if (!groupToDelete) {
        throw new Error("Attribute group not found");
      }

      const response = await fetch(`/admin/attribute-options/${groupToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete attribute");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attribute-groups"] });
      toast.success("Success", {
        description: "Attribute deleted successfully",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to delete attribute",
      });
    },
  });

  const createAttributesMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/admin/attribute-options/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attributes: formData.attributes }),
      });

      if (!response.ok) {
        throw new Error("Failed to create attributes");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attribute-groups"] });

      let description = "";
      if (data.updated_count > 0 && data.created_count > 0) {
        description = `Updated ${data.updated_count} and created ${data.created_count} attribute groups`;
      } else if (data.updated_count > 0) {
        description = `Updated ${data.updated_count} attribute group${
          data.updated_count > 1 ? "s" : ""
        }`;
      } else if (data.created_count > 0) {
        description = `Created ${data.created_count} attribute group${
          data.created_count > 1 ? "s" : ""
        }`;
      }

      toast.success("Success", { description });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to create attributes",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.attributes.length === 0) {
      toast.error("Error", {
        description: "Please add at least one attribute",
      });
      return;
    }
    createAttributesMutation.mutate(data);
  };

  const addNewAttribute = () => {
    append({ group_name: "", options: [] });
  };

  const handleRemoveAttribute = (index: number) => {
    const attributeToRemove = fields[index];
    
    // Check if this attribute exists in the database (has a corresponding group)
    const existingGroup = groups.find(
      g => g.group_name.toLowerCase() === attributeToRemove.group_name?.toLowerCase()
    );
    
    // Remove from form immediately
    remove(index);
    
    // If it exists in database, delete it there too
    if (existingGroup && attributeToRemove.group_name) {
      deleteAttributeMutation.mutate(attributeToRemove.group_name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <>
      <Toaster />
      <Container>
        <div className="flex items-center justify-between mb-6">
          <Heading level="h1">Attribute Options</Heading>
        </div>

        {/* Create New Attributes Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <AttributeFormSection
              key={field.id}
              index={index}
              control={control}
              onRemove={() => handleRemoveAttribute(index)}
              showRemove={fields.length > 1}
            />
          ))}

          <div className="flex justify-end gap-4 mb-6">
            <Button type="button" variant="secondary" onClick={addNewAttribute}>
              <Plus className="w-4 h-4" />
              Create New Attribute
            </Button>

            {fields.length > 0 && (
              <Button
                type="submit"
                disabled={createAttributesMutation.isPending}
              >
                {createAttributesMutation.isPending
                  ? "Saving..."
                  : `Save ${fields.length} Attribute${
                      fields.length > 1 ? "s" : ""
                    }`}
              </Button>
            )}
          </div>
        </form>

        {fields.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No attributes created yet</p>
            <p className="text-sm text-gray-400">
              Click "Create New Attribute" to get started
            </p>
          </div>
        )}
      </Container>
    </>
  );
};

export const config = defineRouteConfig({
  label: "Attribute Options",
  icon: Plus,
});

const AttributeOptionsList = withQueryClientProvider(AttributeOptionsListCore);

export default AttributeOptionsList;
