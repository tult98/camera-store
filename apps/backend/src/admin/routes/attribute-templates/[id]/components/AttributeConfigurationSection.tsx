import { Input, Select, Switch } from "@medusajs/ui";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FieldWithTooltip } from "../../../../components/tooltip-icon";
import { ATTRIBUTE_TOOLTIPS } from "../../../../constants/tooltip-content";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";

interface AttributeConfigurationSectionProps {
  index: number;
  register: UseFormRegister<AttributeTemplateFormData>;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
  watch: UseFormWatch<AttributeTemplateFormData>;
  setValue: UseFormSetValue<AttributeTemplateFormData>;
}

export const AttributeConfigurationSection = ({
  index,
  register,
  control,
  errors,
  watch,
  setValue,
}: AttributeConfigurationSectionProps) => {
  const generateKeyFromLabel = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/^_+|_+$/g, "")
      .substring(0, 50);
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4 flex items-center">
        📝 Attribute Configuration
        <FieldWithTooltip
          label=""
          tooltip={{
            content: "These settings control how admins enter product data",
            color: "blue",
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
            color: "blue",
          }}
          field={
            <div>
              <Input
                {...register(`attribute_definitions.${index}.label`)}
                placeholder="e.g., Sensor Type"
                onChange={(e) => {
                  const generatedKey = generateKeyFromLabel(e.target.value);
                  setValue(`attribute_definitions.${index}.key`, generatedKey);
                  setValue(
                    `attribute_definitions.${index}.label`,
                    e.target.value
                  );
                }}
              />
              {errors.attribute_definitions?.[index]?.label && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.attribute_definitions[index]?.label?.message}
                </p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Generated key:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {watch(`attribute_definitions.${index}.key`) || "auto_generated"}
                </code>
              </div>
            </div>
          }
        />

        <FieldWithTooltip
          label="Input Type"
          tooltip={{ ...ATTRIBUTE_TOOLTIPS["type"], color: "blue" }}
          field={
            <Controller
              name={`attribute_definitions.${index}.type`}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
          tooltip={{ ...ATTRIBUTE_TOOLTIPS["required"], color: "blue" }}
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
          tooltip={{ ...ATTRIBUTE_TOOLTIPS["display_order"], color: "blue" }}
          field={
            <div>
              <Input
                type="number"
                {...register(`attribute_definitions.${index}.display_order`, {
                  valueAsNumber: true,
                })}
                placeholder="1"
              />
              {errors.attribute_definitions?.[index]?.display_order && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.attribute_definitions[index]?.display_order?.message}
                </p>
              )}
            </div>
          }
        />
      </div>

      <input
        type="hidden"
        {...register(`attribute_definitions.${index}.key`)}
      />
    </div>
  );
};
