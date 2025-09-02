import { Input, Select, Switch } from "@medusajs/ui";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";
import { FieldWithTooltip } from "../../../../components/tooltip-icon";
import { FACET_TOOLTIPS } from "../../../../constants/tooltip-content";
import { RangeConfigurationSection } from "./RangeConfigurationSection";

interface FacetConfigurationSectionProps {
  index: number;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
  watch: UseFormWatch<AttributeTemplateFormData>;
  register: UseFormRegister<AttributeTemplateFormData>;
}

export const FacetConfigurationSection = ({
  index,
  control,
  errors,
  watch,
  register,
}: FacetConfigurationSectionProps) => {
  const isFacet = watch(`attribute_definitions.${index}.facet_config.is_facet`);
  const aggregationType = watch(
    `attribute_definitions.${index}.facet_config.aggregation_type`
  );
  const showRangeConfig =
    aggregationType === "range" || aggregationType === "histogram";

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4 flex items-center">
        🔍 Customer Filter Configuration
        <FieldWithTooltip
          label=""
          tooltip={{
            content: "These settings control how customers filter products",
            color: "purple",
          }}
          field={<span />}
        />
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <FieldWithTooltip
          label="Use as Filter"
          tooltip={{ ...FACET_TOOLTIPS["is_facet"], color: "purple" }}
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

        {isFacet && (
          <FieldWithTooltip
            label="Show Count"
            tooltip={{ ...FACET_TOOLTIPS["show_count"], color: "purple" }}
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

        {isFacet && (
          <>
            <FieldWithTooltip
              label="Filter Priority"
              tooltip={{
                ...FACET_TOOLTIPS["display_priority"],
                color: "purple",
              }}
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
                  {errors.attribute_definitions?.[index]?.facet_config
                    ?.display_priority && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.attribute_definitions[index]?.facet_config
                          ?.display_priority?.message
                      }
                    </p>
                  )}
                </div>
              }
            />

            <FieldWithTooltip
              label="Aggregation Type"
              tooltip={{
                ...FACET_TOOLTIPS["aggregation_type"],
                color: "purple",
              }}
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
                  {errors.attribute_definitions?.[index]?.facet_config
                    ?.aggregation_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.attribute_definitions[index]?.facet_config
                          ?.aggregation_type?.message
                      }
                    </p>
                  )}
                </div>
              }
            />

            <FieldWithTooltip
              label="Display Type"
              tooltip={{ ...FACET_TOOLTIPS["display_type"], color: "purple" }}
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
                  {errors.attribute_definitions?.[index]?.facet_config
                    ?.display_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.attribute_definitions[index]?.facet_config
                          ?.display_type?.message
                      }
                    </p>
                  )}
                </div>
              }
            />

            <FieldWithTooltip
              label="Max Display Items"
              tooltip={{
                ...FACET_TOOLTIPS["max_display_items"],
                color: "purple",
              }}
              field={
                <div>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    {...register(
                      `attribute_definitions.${index}.facet_config.max_display_items`,
                      { 
                        valueAsNumber: true,
                        validate: (value) => {
                          if (value && value < 1) return "Must be at least 1";
                          if (value && value > 100) return "Cannot exceed 100 items";
                          return true;
                        }
                      }
                    )}
                    placeholder="5"
                  />
                  {errors.attribute_definitions?.[index]?.facet_config
                    ?.max_display_items && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.attribute_definitions[index]?.facet_config
                          ?.max_display_items?.message
                      }
                    </p>
                  )}
                </div>
              }
            />

            {showRangeConfig && (
              <RangeConfigurationSection
                index={index}
                control={control}
                errors={errors}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
