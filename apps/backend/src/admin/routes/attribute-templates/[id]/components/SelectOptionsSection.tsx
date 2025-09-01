import { Input, Label, Select } from "@medusajs/ui";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";
import { FieldWithTooltip } from "../../../../components/tooltip-icon";
import { ATTRIBUTE_TOOLTIPS } from "../../../../constants/tooltip-content";

interface OptionGroup {
  group_code: string;
  display_name: string;
  options: Array<{ value: string; display_order: number }>;
}

interface CustomOptionsInputProps {
  value?: string[];
  onChange: (value?: string[]) => void;
  placeholder: string;
}

const CustomOptionsInput = ({
  value,
  onChange,
  placeholder,
}: CustomOptionsInputProps) => {
  const [inputValue, setInputValue] = useState(
    Array.isArray(value) ? value.join(", ") : ""
  );

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

interface SelectOptionsSectionProps {
  index: number;
  control: Control<AttributeTemplateFormData>;
  watch: UseFormWatch<AttributeTemplateFormData>;
  setValue: UseFormSetValue<AttributeTemplateFormData>;
  optionGroups: OptionGroup[];
}

export const SelectOptionsSection = ({
  index,
  control,
  watch,
  setValue,
  optionGroups,
}: SelectOptionsSectionProps) => {
  if (watch(`attribute_definitions.${index}.type`) !== "select") {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <FieldWithTooltip
        label="Option Source"
        tooltip={{ ...ATTRIBUTE_TOOLTIPS["options"], color: "blue" }}
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
                      field.onChange(null);
                      setValue(
                        `attribute_definitions.${index}.options`,
                        undefined
                      );
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
                      field.onChange("__placeholder__");
                      setValue(
                        `attribute_definitions.${index}.options`,
                        undefined
                      );
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
                value={
                  field.value === "__placeholder__" ? "" : field.value || ""
                }
                onValueChange={field.onChange}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose an option group" />
                </Select.Trigger>
                <Select.Content>
                  {optionGroups.map((group: OptionGroup) => (
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
            watch(`attribute_definitions.${index}.option_group`) !==
              "__placeholder__" && (
              <div className="mt-2 text-sm text-gray-600">
                Options:{" "}
                {optionGroups
                  .find(
                    (g: OptionGroup) =>
                      g.group_code ===
                      watch(`attribute_definitions.${index}.option_group`)
                  )
                  ?.options.map(
                    (o: { value: string; display_order: number }) => o.value
                  )
                  .join(", ") || "No options available"}
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
  );
};
