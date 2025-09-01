import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PencilSquare, Plus, Trash } from "@medusajs/icons";
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Table,
  Toaster,
  toast,
  usePrompt,
} from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { withQueryClientProvider } from "../../utils/query-client";

type AttributeOption = {
  id: string;
  group_code: string;
  value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const fetchAttributeOptions = async (): Promise<AttributeOption[]> => {
  const response = await fetch("/admin/attribute-options");
  if (!response.ok) {
    throw new Error("Failed to fetch attribute options");
  }
  const data = await response.json();
  return data.attribute_options || [];
};

const AttributeOptionsListCore = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const prompt = usePrompt();
  const queryClient = useQueryClient();
  const [newOption, setNewOption] = useState({
    group_code: "",
    value: "",
    display_order: 0,
    is_active: true,
  });

  const {
    data: options = [],
    isLoading,
    error,
  } = useQuery<AttributeOption[]>({
    queryKey: ["attribute-options"],
    queryFn: fetchAttributeOptions,
  });

  if (error) {
    toast.error("Error", {
      description: "Failed to load attribute options",
    });
  }

  const createOptionMutation = useMutation({
    mutationFn: async (option: typeof newOption) => {
      const response = await fetch("/admin/attribute-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(option),
      });

      if (!response.ok) {
        throw new Error("Failed to create attribute option");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] });
      setNewOption({
        group_code: "",
        value: "",
        display_order: 0,
        is_active: true,
      });
      toast.success("Success", {
        description: `Attribute option "${data.attribute_option.value}" created successfully`,
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to create attribute option",
      });
    },
  });

  const handleCreateOption = () => {
    if (!newOption.group_code || !newOption.value) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      });
      return;
    }
    createOptionMutation.mutate(newOption);
  };

  const updateOptionMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<AttributeOption>;
    }) => {
      const response = await fetch(`/admin/attribute-options/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update attribute option");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] });
      setEditingId(null);
      toast.success("Success", {
        description: `Attribute option "${data.attribute_option.value}" updated successfully`,
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update attribute option",
      });
    },
  });

  const handleUpdateOption = (
    id: string,
    updates: Partial<AttributeOption>
  ) => {
    updateOptionMutation.mutate({ id, updates });
  };

  const deleteOptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/admin/attribute-options/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete attribute option");
      }

      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] });
      const deletedOption = options.find(
        (opt: AttributeOption) => opt.id === id
      );
      if (deletedOption) {
        toast.success("Success", {
          description: `Attribute option "${deletedOption.value}" deleted successfully`,
        });
      }
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to delete attribute option",
      });
    },
  });

  const handleDelete = async (id: string, option: AttributeOption) => {
    const confirmed = await prompt({
      title: "Delete attribute option",
      description: `Are you sure you want to delete "${option.value}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    deleteOptionMutation.mutate(id);
  };

  const groupedOptions = options.reduce(
    (groups: Record<string, AttributeOption[]>, option: AttributeOption) => {
      const key = option.group_code;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(option);
      return groups;
    },
    {} as Record<string, AttributeOption[]>
  );

  const updateLocalOption = (id: string, updates: Partial<AttributeOption>) => {
    queryClient.setQueryData<AttributeOption[]>(
      ["attribute-options"],
      (old = []) =>
        old.map((opt: AttributeOption) =>
          opt.id === id ? { ...opt, ...updates } : opt
        )
    );
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

        {/* Create New Option Form */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Option</h3>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Group Code</Label>
              <Input
                value={newOption.group_code}
                onChange={(e) =>
                  setNewOption({ ...newOption, group_code: e.target.value })
                }
                placeholder="e.g., sensor_types"
              />
            </div>

            <div>
              <Label>Value</Label>
              <Input
                value={newOption.value}
                onChange={(e) =>
                  setNewOption({ ...newOption, value: e.target.value })
                }
                placeholder="Full Frame"
              />
            </div>

            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={newOption.display_order}
                onChange={(e) =>
                  setNewOption({
                    ...newOption,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleCreateOption} className="w-full">
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            </div>
          </div>
        </div>

        {/* Options by Group */}
        {Object.entries(groupedOptions).map(([groupCode, groupOptions]) => (
          <div key={groupCode} className="mb-8">
            <h3 className="text-lg font-medium mb-4">{groupCode} Options</h3>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                  <Table.HeaderCell>Display Order</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Created</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Actions
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {groupOptions
                  .sort(
                    (a: AttributeOption, b: AttributeOption) =>
                      a.display_order - b.display_order
                  )
                  .map((option: AttributeOption) => (
                    <Table.Row key={option.id}>
                      <Table.Cell>
                        {editingId === option.id ? (
                          <Input
                            value={option.value}
                            onChange={(e) =>
                              updateLocalOption(option.id, {
                                value: e.target.value,
                              })
                            }
                            className="w-full"
                          />
                        ) : (
                          <span className="font-mono text-sm">
                            {option.value}
                          </span>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        {editingId === option.id ? (
                          <Input
                            type="number"
                            value={option.display_order}
                            onChange={(e) =>
                              updateLocalOption(option.id, {
                                display_order: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20"
                          />
                        ) : (
                          option.display_order
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            option.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {option.is_active ? "Active" : "Inactive"}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(option.created_at).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === option.id ? (
                            <>
                              <Button
                                variant="secondary"
                                size="small"
                                onClick={() =>
                                  handleUpdateOption(option.id, option)
                                }
                              >
                                Save
                              </Button>
                              <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setEditingId(option.id)}
                              >
                                <PencilSquare className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="transparent"
                                size="small"
                                onClick={() => handleDelete(option.id, option)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        ))}

        {Object.keys(groupedOptions).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No attribute options found</p>
            <p className="text-sm text-gray-400">
              Add your first option using the form above
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
