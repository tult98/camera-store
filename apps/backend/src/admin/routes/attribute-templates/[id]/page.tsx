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
import { FieldWithTooltip } from "../../../components/tooltip-icon";
import { ATTRIBUTE_TOOLTIPS, FACET_TOOLTIPS } from "../../../constants/tooltip-content";

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
  const [inputValue, setInputValue] = useState(
    Array.isArray(value) ? value.join(", ") : ""
  );
  
  // Update input value when prop changes
  useEffect(() => {
    setInputValue(Array.isArray(value) ? value.join(", ") : "");
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
    mode: "onBlur",
    reValidateMode: "onBlur",
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

  // Function to generate key from label
  const generateKeyFromLabel = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .substring(0, 50); // Limit length
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
            <div className="mb-4">
              <h3 className="text-lg font-medium">Attribute Definitions</h3>
            </div>

            <div className="space-y-6">
              {attributeFields.map((field, index) => (
                <div key={field.id} className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Attribute {index + 1}</h4>
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => handleRemoveAttribute(index)}
                      type="button"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Attribute Configuration Section */}
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      📝 Attribute Configuration
                      <FieldWithTooltip
                        label=""
                        tooltip={{
                          content: "These settings control how admins enter product data",
                          color: "blue"
                        }}
                        field={<span />}
                      />
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FieldWithTooltip
                        label="Label"
                        required
                        tooltip={{
                          content: "Display name shown to admins in product forms",
                          examples: "Sensor Type, Resolution, Brand",
                          note: "Key will be auto-generated from this label",
                          color: "blue"
                        }}
                        field={
                          <Input
                            {...register(`attribute_definitions.${index}.label`)}
                            placeholder="e.g., Sensor Type"
                            onChange={(e) => {
                              // Auto-generate key when label changes
                              const generatedKey = generateKeyFromLabel(e.target.value);
                              setValue(`attribute_definitions.${index}.key`, generatedKey);
                              // Also update the label field
                              setValue(`attribute_definitions.${index}.label`, e.target.value);
                            }}
                          />
                        }
                      />

                      <FieldWithTooltip
                        label="Input Type"
                        tooltip={{...ATTRIBUTE_TOOLTIPS.type, color: "blue"}}
                        field={
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
                        }
                      />

                      <FieldWithTooltip
                        label="Required"
                        tooltip={{...ATTRIBUTE_TOOLTIPS.required, color: "blue"}}
                        field={
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
                        }
                      />

                      <FieldWithTooltip
                        label="Display Order"
                        tooltip={{...ATTRIBUTE_TOOLTIPS.display_order, color: "blue"}}
                        field={
                          <Input
                            type="number"
                            {...register(
                              `attribute_definitions.${index}.display_order`,
                              { valueAsNumber: true }
                            )}
                            placeholder="1"
                          />
                        }
                      />
                    </div>

                    {/* Hidden key field - auto-generated from label */}
                    <input
                      type="hidden"
                      {...register(`attribute_definitions.${index}.key`)}
                    />

                    {/* Show generated key for reference */}
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">
                        Generated key: <code className="bg-gray-100 px-1 rounded">{watch(`attribute_definitions.${index}.key`) || 'auto_generated'}</code>
                      </div>
                    </div>


                    {/* Select Options */}
                    {watch(`attribute_definitions.${index}.type`) === "select" && (
                      <div className="mt-4 space-y-3">
                        <FieldWithTooltip
                          label="Option Source"
                          tooltip={{...ATTRIBUTE_TOOLTIPS.options, color: "blue"}}
                          field={
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
                                        field.onChange(null)
                                        setValue(`attribute_definitions.${index}.options`, undefined)
                                      }}
                                    />
                                  )}
                                />
                                <span className="text-sm text-gray-700">Custom Options</span>
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
                                <span className="text-sm text-gray-700">Use Option Group</span>
                              </label>
                            </div>
                          }
                        />

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
                                        {group.display_name} ({group.options.length} options)
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select>
                              )}
                            />
                            {watch(`attribute_definitions.${index}.option_group`) && 
                            watch(`attribute_definitions.${index}.option_group`) !== "__placeholder__" && (
                              <div className="mt-2 text-sm text-gray-600">
                                Options:{" "}
                                {optionGroups
                                  .find(
                                    (g) =>
                                      g.group_code ===
                                      watch(`attribute_definitions.${index}.option_group`)
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

                  </div>

                  {/* Facet Configuration Section */}
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      🔍 Customer Filter Configuration
                      <FieldWithTooltip
                        label=""
                        tooltip={{
                          content: "These settings control how customers filter products",
                          color: "purple"
                        }}
                        field={<span />}
                      />
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FieldWithTooltip
                        label="Use as Filter"
                        tooltip={{...FACET_TOOLTIPS.is_facet, color: "purple"}}
                        field={
                          <Controller
                            name={`attribute_definitions.${index}.facet_config.is_facet`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                        }
                      />

                      {/* Show facet config only when facet is enabled */}
                      {watch(`attribute_definitions.${index}.facet_config.is_facet`) && (
                        <FieldWithTooltip
                          label="Show Count"
                          tooltip={{...FACET_TOOLTIPS.show_count, color: "purple"}}
                          field={
                            <Controller
                              name={`attribute_definitions.${index}.facet_config.show_count`}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  checked={field.value ?? true}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                          }
                        />
                      )}

                      {watch(`attribute_definitions.${index}.facet_config.is_facet`) && (
                        <>
                          <FieldWithTooltip
                            label="Filter Priority"
                            tooltip={{...FACET_TOOLTIPS.display_priority, color: "purple"}}
                            field={
                              <div>
                                <Input
                                  type="number"
                                  min="1"
                                  {...register(
                                    `attribute_definitions.${index}.facet_config.display_priority`,
                                    { valueAsNumber: true }
                                  )}
                                  placeholder="1"
                                />
                                {errors.attribute_definitions?.[index]?.facet_config?.display_priority && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.attribute_definitions[index]?.facet_config?.display_priority?.message}
                                  </p>
                                )}
                              </div>
                            }
                          />

                          <FieldWithTooltip
                            label="Aggregation Type"
                            tooltip={{...FACET_TOOLTIPS.aggregation_type, color: "purple"}}
                            field={
                              <div>
                                <Controller
                                  name={`attribute_definitions.${index}.facet_config.aggregation_type`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value || "term"}
                                      onValueChange={field.onChange}
                                    >
                                      <Select.Trigger>
                                        <Select.Value />
                                      </Select.Trigger>
                                      <Select.Content>
                                        <Select.Item value="term">Term</Select.Item>
                                        <Select.Item value="range">Range</Select.Item>
                                        <Select.Item value="histogram">Histogram</Select.Item>
                                        <Select.Item value="boolean">Boolean</Select.Item>
                                      </Select.Content>
                                    </Select>
                                  )}
                                />
                                {errors.attribute_definitions?.[index]?.facet_config?.aggregation_type && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.attribute_definitions[index]?.facet_config?.aggregation_type?.message}
                                  </p>
                                )}
                              </div>
                            }
                          />

                          <FieldWithTooltip
                            label="Display Type"
                            tooltip={{...FACET_TOOLTIPS.display_type, color: "purple"}}
                            field={
                              <div>
                                <Controller
                                  name={`attribute_definitions.${index}.facet_config.display_type`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value || "checkbox"}
                                      onValueChange={field.onChange}
                                    >
                                      <Select.Trigger>
                                        <Select.Value />
                                      </Select.Trigger>
                                      <Select.Content>
                                        <Select.Item value="checkbox">Checkbox</Select.Item>
                                        <Select.Item value="radio">Radio</Select.Item>
                                        <Select.Item value="slider">Slider</Select.Item>
                                        <Select.Item value="dropdown">Dropdown</Select.Item>
                                        <Select.Item value="toggle">Toggle</Select.Item>
                                      </Select.Content>
                                    </Select>
                                  )}
                                />
                                {errors.attribute_definitions?.[index]?.facet_config?.display_type && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.attribute_definitions[index]?.facet_config?.display_type?.message}
                                  </p>
                                )}
                              </div>
                            }
                          />

                          <FieldWithTooltip
                            label="Max Display Items"
                            tooltip={{...FACET_TOOLTIPS.max_display_items, color: "purple"}}
                            field={
                              <div>
                                <Controller
                                  name={`attribute_definitions.${index}.facet_config.max_display_items`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      type="number"
                                      min="1"
                                      value={field.value || 5}
                                      onChange={(e) => {
                                        const value = e.target.value === "" ? 5 : Number(e.target.value);
                                        field.onChange(isNaN(value) ? 5 : value);
                                      }}
                                      placeholder="5"
                                    />
                                  )}
                                />
                                {errors.attribute_definitions?.[index]?.facet_config?.max_display_items && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.attribute_definitions[index]?.facet_config?.max_display_items?.message}
                                  </p>
                                )}
                              </div>
                            }
                          />

                          {/* Range Configuration for range/histogram facets */}
                          {(watch(`attribute_definitions.${index}.facet_config.aggregation_type`) === "range" || 
                            watch(`attribute_definitions.${index}.facet_config.aggregation_type`) === "histogram") && (
                            <div className="col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
                              <h4 className="font-medium mb-3 text-purple-700 flex items-center">
                                Range Configuration
                                <FieldWithTooltip
                                  label=""
                                  tooltip={{...FACET_TOOLTIPS.range_config, color: "purple"}}
                                  field={<span />}
                                />
                              </h4>
                              <div className="grid grid-cols-3 gap-4">
                                <FieldWithTooltip
                                  label="Min Value"
                                  tooltip={{...FACET_TOOLTIPS.range_min, color: "purple"}}
                                  field={
                                    <div>
                                      <Controller
                                        name={`attribute_definitions.${index}.facet_config.range_config.min`}
                                        control={control}
                                        render={({ field }) => (
                                          <Input
                                            type="number"
                                            value={field.value || ""}
                                            onChange={(e) => {
                                              const value = e.target.value === "" ? undefined : Number(e.target.value);
                                              field.onChange(value);
                                            }}
                                            placeholder="Auto-detect"
                                          />
                                        )}
                                      />
                                      {errors.attribute_definitions?.[index]?.facet_config?.range_config?.min && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {errors.attribute_definitions[index]?.facet_config?.range_config?.min?.message}
                                        </p>
                                      )}
                                    </div>
                                  }
                                />

                                <FieldWithTooltip
                                  label="Max Value"
                                  tooltip={{...FACET_TOOLTIPS.range_max, color: "purple"}}
                                  field={
                                    <div>
                                      <Controller
                                        name={`attribute_definitions.${index}.facet_config.range_config.max`}
                                        control={control}
                                        render={({ field }) => (
                                          <Input
                                            type="number"
                                            value={field.value || ""}
                                            onChange={(e) => {
                                              const value = e.target.value === "" ? undefined : Number(e.target.value);
                                              field.onChange(value);
                                            }}
                                            placeholder="Auto-detect"
                                          />
                                        )}
                                      />
                                      {errors.attribute_definitions?.[index]?.facet_config?.range_config?.max && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {errors.attribute_definitions[index]?.facet_config?.range_config?.max?.message}
                                        </p>
                                      )}
                                    </div>
                                  }
                                />

                                <FieldWithTooltip
                                  label="Step"
                                  tooltip={{...FACET_TOOLTIPS.range_step, color: "purple"}}
                                  field={
                                    <div>
                                      <Controller
                                        name={`attribute_definitions.${index}.facet_config.range_config.step`}
                                        control={control}
                                        render={({ field }) => (
                                          <Input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={field.value || ""}
                                            onChange={(e) => {
                                              const value = e.target.value === "" ? undefined : Number(e.target.value);
                                              field.onChange(value);
                                            }}
                                            placeholder="Auto-detect"
                                          />
                                        )}
                                      />
                                      {errors.attribute_definitions?.[index]?.facet_config?.range_config?.step && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {errors.attribute_definitions[index]?.facet_config?.range_config?.step?.message}
                                        </p>
                                      )}
                                    </div>
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
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

            {/* Add Attribute Button - Moved to bottom */}
            <div className="mt-6 flex justify-center">
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
