import { zodResolver } from "@hookform/resolvers/zod";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ArrowUturnLeft, Plus, Trash } from "@medusajs/icons";
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Textarea,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AttributeTemplateFormData,
  AttributeTemplateSchema,
  defaultAttributeDefinition,
  defaultAttributeTemplate,
} from "../schemas/attribute-template.schema";

interface OptionGroup {
  group_code: string;
  display_name: string;
  options: Array<{ value: string; label: string }>;
}

// Separate component to handle custom options input
const CustomOptionsInput = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value?: string[]; 
  onChange: (value?: string[]) => void;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState(value?.join(", ") || "");
  
  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value?.join(", ") || "");
  }, [value]);
  
  return (
    <Input
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onBlur={(e) => {
        const options = e.target.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        onChange(options.length > 0 ? options : undefined);
      }}
      placeholder={placeholder}
    />
  );
};

const AttributeTemplateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== "new";

  // Setup react-hook-form with Zod validation
  const form = useForm<AttributeTemplateFormData>({
    // @ts-expect-error - Zod resolver type mismatch with default values
    resolver: zodResolver(AttributeTemplateSchema),
    defaultValues: defaultAttributeTemplate,
    mode: "onBlur", // Validate on blur for better UX
  });

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = form;

  // Field array for dynamic attribute definitions
  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "attribute_definitions",
  });

  // Non-form state
  const [loading, setLoading] = useState(isEditing);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);

  useEffect(() => {
    if (isEditing) {
      fetchTemplate();
    }
    fetchOptionGroups();
  }, [id, isEditing]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/admin/attribute-templates/${id}`);
      const data = await response.json();
      const templateData = { ...data.attribute_template, id };

      // Reset form with fetched data
      reset(templateData);
    } catch {
      toast.error("Failed to fetch template");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptionGroups = async () => {
    try {
      const response = await fetch("/admin/attribute-options/groups");
      const data = await response.json();
      setOptionGroups(data.option_groups || []);
    } catch {
      toast.error("Failed to fetch option groups");
    }
  };

  // Form submission handler
  const onSubmit: SubmitHandler<AttributeTemplateFormData> = async (data) => {
    try {
      const url = isEditing
        ? `/admin/attribute-templates/${id}`
        : "/admin/attribute-templates";

      // Clean up placeholder values before submission
      const cleanedData = {
        ...data,
        attribute_definitions: data.attribute_definitions.map((def) => ({
          ...def,
          option_group: def.option_group === "__placeholder__" ? undefined : def.option_group,
        })),
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        const actionText = isEditing ? "updated" : "created";
        toast.success(
          `Attribute template "${data.name}" has been ${actionText} successfully.`
        );
        navigate("/attribute-templates");
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details || errorData.message || "Failed to save template";

        if (response.status === 400 && errorData.error === "Validation Error") {
          toast.error(errorMessage);
          return;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      const actionText = isEditing ? "update" : "create";
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      toast.error(
        `Failed to ${actionText} attribute template: ${errorMessage}`
      );
    }
  };

  const handleAddAttribute = () => {
    appendAttribute(defaultAttributeDefinition);
  };

  const handleRemoveAttribute = (index: number) => {
    removeAttribute(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <Container>
      <form
        onSubmit={form.handleSubmit(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit as any
        )}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link to="/attribute-templates">
            <Button variant="transparent" size="small" type="button">
              <ArrowUturnLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Heading level="h1">
            {isEditing ? "Edit Template" : "Create Template"}
          </Heading>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  Template Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Digital Camera Attributes"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="code">
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  {...register("code")}
                  placeholder="e.g., camera_digital"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Optional description for this template"
              />
            </div>
          </div>

          {/* Attribute Definitions */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Attribute Definitions</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={handleAddAttribute}
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add Attribute
              </Button>
            </div>

            <div className="space-y-4">
              {attributeFields.map((field, index) => (
                <div key={field.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Attribute {index + 1}</h4>
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => handleRemoveAttribute(index)}
                      type="button"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Key</Label>
                      <Input
                        {...register(`attribute_definitions.${index}.key`)}
                        placeholder="e.g., sensor_type"
                      />
                      {errors.attribute_definitions?.[index]?.key && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.attribute_definitions[index]?.key?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Label</Label>
                      <Input
                        {...register(`attribute_definitions.${index}.label`)}
                        placeholder="e.g., Sensor Type"
                      />
                      {errors.attribute_definitions?.[index]?.label && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.attribute_definitions[index]?.label?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Type</Label>
                      <Controller
                        name={`attribute_definitions.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <Select.Trigger>
                              <Select.Value placeholder="Select type" />
                            </Select.Trigger>
                            <Select.Content>
                              <Select.Item value="text">Text</Select.Item>
                              <Select.Item value="number">Number</Select.Item>
                              <Select.Item value="select">Select</Select.Item>
                              <Select.Item value="boolean">Boolean</Select.Item>
                            </Select.Content>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label>Help Text</Label>
                      <Input
                        {...register(
                          `attribute_definitions.${index}.help_text`
                        )}
                        placeholder="Optional help text"
                      />
                    </div>

                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        {...register(
                          `attribute_definitions.${index}.placeholder`
                        )}
                        placeholder="Input placeholder"
                      />
                    </div>
                  </div>

                  {/* Select Options */}
                  {watch(`attribute_definitions.${index}.type`) ===
                    "select" && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <Label>Option Source</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center space-x-2">
                            <Controller
                              name={`attribute_definitions.${index}.option_group`}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="radio"
                                  name={`option_source_${index}`}
                                  checked={!field.value}
                                  onChange={() => {
                                    field.onChange(undefined)
                                    setValue(`attribute_definitions.${index}.options`, undefined)
                                  }}
                                />
                              )}
                            />
                            <span className="text-sm text-gray-700">
                              Custom Options
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <Controller
                              name={`attribute_definitions.${index}.option_group`}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="radio"
                                  name={`option_source_${index}`}
                                  checked={!!field.value}
                                  onChange={() => {
                                    field.onChange("__placeholder__")
                                    setValue(`attribute_definitions.${index}.options`, undefined)
                                  }}
                                />
                              )}
                            />
                            <span className="text-sm text-gray-700">
                              Use Option Group
                            </span>
                          </label>
                        </div>
                      </div>

                      {watch(`attribute_definitions.${index}.option_group`) ? (
                        <div>
                          <Label>Select Option Group</Label>
                          <Controller
                            name={`attribute_definitions.${index}.option_group`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value === "__placeholder__" ? "" : field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <Select.Trigger>
                                  <Select.Value placeholder="Choose an option group" />
                                </Select.Trigger>
                                <Select.Content>
                                  {optionGroups.map((group) => (
                                    <Select.Item
                                      key={group.group_code}
                                      value={group.group_code}
                                    >
                                      {group.display_name} (
                                      {group.options.length} options)
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select>
                            )}
                          />
                          {watch(
                            `attribute_definitions.${index}.option_group`
                          ) && 
                          watch(
                            `attribute_definitions.${index}.option_group`
                          ) !== "__placeholder__" && (
                            <div className="mt-2 text-sm text-gray-600">
                              Options:{" "}
                              {optionGroups
                                .find(
                                  (g) =>
                                    g.group_code ===
                                    watch(
                                      `attribute_definitions.${index}.option_group`
                                    )
                                )
                                ?.options.map((o) => o.label)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Label>Custom Options (comma separated)</Label>
                          <Controller
                            name={`attribute_definitions.${index}.options`}
                            control={control}
                            render={({ field }) => (
                              <CustomOptionsInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="e.g., Full Frame, APS-C, Micro Four Thirds"
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`attribute_definitions.${index}.required`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label>Required</Label>
                    </div>

                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        className="w-24"
                        {...register(
                          `attribute_definitions.${index}.display_order`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {attributeFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No attributes defined. Click "Add Attribute" to get started.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link to="/attribute-templates">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Attribute Template",
});

export default AttributeTemplateForm;
