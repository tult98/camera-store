import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Button,
  Select,
  Input,
  Label,
  Switch,
  Toaster,
  toast,
} from "@medusajs/ui";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { withQueryClientProvider } from "../utils/query-client";

type AttributeDefinition = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  options?: string[];
  option_group?: string;
  required: boolean;
  display_order: number;
  unit?: string;
  default_value?: string | number | boolean;
};

type AttributeTemplate = {
  id: string;
  name: string;
  code: string;
  attribute_definitions: AttributeDefinition[];
  is_active: boolean;
};

const ProductAttributesWidgetCore = ({ data }: { data: { id: string } }) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<AttributeTemplate | null>(null);
  const [attributeValues, setAttributeValues] = useState<Record<string, string | number | boolean>>(
    {}
  );
  const queryClient = useQueryClient();

  const productId = data.id;

  // Fetch templates
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ["attribute-templates"],
    queryFn: async () => {
      const response = await fetch("/admin/attribute-templates");
      const data = await response.json();
      return (
        data.attribute_templates?.filter(
          (t: AttributeTemplate) => t.is_active
        ) || []
      );
    },
  });

  // Fetch option groups
  const { data: optionGroupsData } = useQuery({
    queryKey: ["attribute-option-groups"],
    queryFn: async () => {
      const response = await fetch("/admin/attribute-options");
      const data = await response.json();

      // Convert array to lookup object by group_name
      const groupsMap: Record<string, { group_name: string; options: string[] }> = {};
      data.attribute_groups?.forEach((group: { group_name: string; options: string[] }) => {
        groupsMap[group.group_name] = group;
      });
      return groupsMap;
    },
  });

  // Fetch product attributes
  const { data: productAttributesData, isLoading: productAttributesLoading } =
    useQuery({
      queryKey: ["product-attributes", productId],
      queryFn: async () => {
        const response = await fetch(
          `/admin/product-attributes?product_id=${productId}`
        );
        const data = await response.json();
        return data.product_attributes?.[0] || null;
      },
      enabled: !!productId,
    });

  // Resolve options from templates and option groups
  const resolvedOptions = useMemo(() => {
    if (!selectedTemplate || !optionGroupsData) return {};

    const resolved: Record<string, { value: string; label: string }[]> = {};

    selectedTemplate.attribute_definitions.forEach((attr) => {
      if (attr.type === "select") {
        if (attr.option_group && optionGroupsData[attr.option_group]) {
          const groupOptions =
            optionGroupsData[attr.option_group].options || [];
          resolved[attr.key] = groupOptions
            .map((opt) => ({
              value: opt,
              label: opt,
            }));
        } else if (attr.options && Array.isArray(attr.options)) {
          resolved[attr.key] = attr.options.map((opt) => ({
            value: opt,
            label: opt,
          }));
        }
      }
    });

    return resolved;
  }, [selectedTemplate, optionGroupsData]);

  // Set initial template and values when product attributes are loaded
  const templates = templatesData || [];
  const productAttributes = productAttributesData;

  // Initialize template and values when data is loaded
  useEffect(() => {
    if (productAttributes && templates.length > 0 && !selectedTemplate) {
      const template = templates.find(
        (t: AttributeTemplate) => t.id === productAttributes.template_id
      );
      if (template) {
        setSelectedTemplate(template);
        setAttributeValues(productAttributes.attribute_values || {});
      }
    }
  }, [productAttributes, templates, selectedTemplate]);

  // Mutation for saving product attributes
  const saveAttributesMutation = useMutation({
    mutationFn: async (payload: {
      product_id: string;
      template_id: string;
      attribute_values: Record<string, string | number | boolean>;
    }) => {
      const url = productAttributes?.id
        ? `/admin/product-attributes/${productAttributes.id}`
        : "/admin/product-attributes";

      const method = productAttributes?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save attributes");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch product attributes
      queryClient.invalidateQueries({
        queryKey: ["product-attributes", productId],
      });
      toast.success("Success", {
        description: "Product attributes saved successfully!",
      });
    },
    onError: (_error: Error) => {
      toast.error("Error", {
        description: "Failed to save attributes. Please try again.",
      });
    },
  });

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t: AttributeTemplate) => t.id === templateId);
    setSelectedTemplate(template || null);

    // Initialize attribute values with defaults
    if (template) {
      const initialValues: Record<string, string | number | boolean> = {};

      template.attribute_definitions.forEach((attr: AttributeDefinition) => {
        if (attr.default_value !== undefined) {
          initialValues[attr.key] = attr.default_value;
        }
      });

      setAttributeValues(initialValues);
    } else {
      setAttributeValues({});
    }
  };

  const handleAttributeValueChange = (key: string, value: string | number | boolean) => {
    setAttributeValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!selectedTemplate) return;

    const payload = {
      product_id: productId,
      template_id: selectedTemplate.id,
      attribute_values: attributeValues,
    };

    saveAttributesMutation.mutate(payload);
  };

  const renderAttributeInput = (attr: AttributeDefinition) => {
    const value = attributeValues[attr.key] || "";

    switch (attr.type) {
      case "text":
        return (
          <Input
            value={String(value)}
            onChange={(e) =>
              handleAttributeValueChange(attr.key, e.target.value)
            }
          />
        );

      case "number":
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={String(value)}
              onChange={(e) =>
                handleAttributeValueChange(
                  attr.key,
                  parseFloat(e.target.value) || 0
                )
              }
            />
            {attr.unit && (
              <span className="text-sm text-gray-500">{attr.unit}</span>
            )}
          </div>
        );

      case "select":
        const options = resolvedOptions[attr.key] || [];

        return (
          <Select
            value={String(value) || undefined}
            onValueChange={(val) => handleAttributeValueChange(attr.key, val)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select an option" />
            </Select.Trigger>
            <Select.Content>
              {options.length > 0 ? (
                options.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))
              ) : (
                <Select.Item value="no-options" disabled>
                  No options available
                </Select.Item>
              )}
            </Select.Content>
          </Select>
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={(checked) =>
                handleAttributeValueChange(attr.key, checked)
              }
            />
            <span className="text-sm">{value ? "Yes" : "No"}</span>
          </div>
        );

      default:
        return null;
    }
  };

  const isLoading = templatesLoading || productAttributesLoading;

  if (isLoading) {
    return <div className="p-4">Loading attributes...</div>;
  }

  return (
    <Container>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading level="h3">Product Attributes</Heading>
          {selectedTemplate && (
            <Button
              onClick={handleSave}
              disabled={saveAttributesMutation.isPending}
            >
              {saveAttributesMutation.isPending
                ? "Saving..."
                : "Save Attributes"}
            </Button>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <Label htmlFor="template">Attribute Template</Label>
          <Select
            value={selectedTemplate?.id || undefined}
            onValueChange={handleTemplateChange}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a template" />
            </Select.Trigger>
            <Select.Content>
              {templates.map((template: AttributeTemplate) => (
                <Select.Item key={template.id} value={template.id}>
                  {template.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Attribute Fields */}
        {selectedTemplate && (
          <div className="space-y-4">
            <h4 className="font-medium">Attributes</h4>

            {selectedTemplate.attribute_definitions
              .sort((a, b) => a.display_order - b.display_order)
              .map((attr) => (
                <div key={attr.key} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={attr.key}>
                      {attr.label}
                      {attr.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                  </div>

                  {renderAttributeInput(attr)}
                </div>
              ))}
          </div>
        )}

        {templates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No attribute templates available.</p>
            <p className="text-sm">
              Create templates to start adding attributes to products.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

// Apply HOC to create the final component
const ProductAttributesWidget = withQueryClientProvider(ProductAttributesWidgetCore);

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductAttributesWidget;
