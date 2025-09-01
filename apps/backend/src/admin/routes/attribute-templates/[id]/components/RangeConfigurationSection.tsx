import { Input } from "@medusajs/ui";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";
import { FieldWithTooltip } from "../../../../components/tooltip-icon";
import { FACET_TOOLTIPS } from "../../../../constants/tooltip-content";

interface RangeConfigurationSectionProps {
  index: number;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
}

export const RangeConfigurationSection = ({
  index,
  control,
  errors,
}: RangeConfigurationSectionProps) => {
  return (
    <div className="col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-3 text-purple-700 flex items-center">
        Range Configuration
        <FieldWithTooltip
          label=""
          tooltip={{ ...FACET_TOOLTIPS["range_config"], color: "purple" }}
          field={<span />}
        />
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <FieldWithTooltip
          label="Min Value"
          tooltip={{ ...FACET_TOOLTIPS["range_min"], color: "purple" }}
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
                      const value =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(value);
                    }}
                    placeholder="Auto-detect"
                  />
                )}
              />
              {errors.attribute_definitions?.[index]?.facet_config?.range_config
                ?.min && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.attribute_definitions[index]?.facet_config
                      ?.range_config?.min?.message
                  }
                </p>
              )}
            </div>
          }
        />

        <FieldWithTooltip
          label="Max Value"
          tooltip={{ ...FACET_TOOLTIPS["range_max"], color: "purple" }}
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
                      const value =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(value);
                    }}
                    placeholder="Auto-detect"
                  />
                )}
              />
              {errors.attribute_definitions?.[index]?.facet_config?.range_config
                ?.max && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.attribute_definitions[index]?.facet_config
                      ?.range_config?.max?.message
                  }
                </p>
              )}
            </div>
          }
        />

        <FieldWithTooltip
          label="Step"
          tooltip={{ ...FACET_TOOLTIPS["range_step"], color: "purple" }}
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
                      const value =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(value);
                    }}
                    placeholder="Auto-detect"
                  />
                )}
              />
              {errors.attribute_definitions?.[index]?.facet_config?.range_config
                ?.step && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.attribute_definitions[index]?.facet_config
                      ?.range_config?.step?.message
                  }
                </p>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};
