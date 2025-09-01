import { Button } from "@medusajs/ui";
import { Plus } from "@medusajs/icons";
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";
import { AttributeDefinitionItem } from "./AttributeDefinitionItem";

interface OptionGroup {
  group_code: string;
  display_name: string;
  options: Array<{ value: string; display_order: number }>;
}

interface AttributeDefinitionsSectionProps {
  attributeFields: FieldArrayWithId<
    AttributeTemplateFormData,
    "attribute_definitions",
    "id"
  >[];
  register: UseFormRegister<AttributeTemplateFormData>;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
  watch: UseFormWatch<AttributeTemplateFormData>;
  setValue: UseFormSetValue<AttributeTemplateFormData>;
  optionGroups: OptionGroup[];
  onAddAttribute: () => void;
  onRemoveAttribute: (index: number) => void;
}

export const AttributeDefinitionsSection = ({
  attributeFields,
  register,
  control,
  errors,
  watch,
  setValue,
  optionGroups,
  onAddAttribute,
  onRemoveAttribute,
}: AttributeDefinitionsSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Attribute Definitions</h3>
      </div>

      <div className="space-y-6">
        {attributeFields.map((field, index) => (
          <AttributeDefinitionItem
            key={field.id}
            index={index}
            fieldId={field.id}
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            optionGroups={optionGroups}
            onRemove={onRemoveAttribute}
          />
        ))}
      </div>

      {attributeFields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No attributes defined. Click "Add Attribute" to get started.
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          variant="secondary"
          size="small"
          onClick={onAddAttribute}
          type="button"
        >
          <Plus className="w-4 h-4" />
          Add Attribute
        </Button>
      </div>
    </div>
  );
};
