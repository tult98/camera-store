import { Button } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";
import { AttributeConfigurationSection } from "./AttributeConfigurationSection";
import { SelectOptionsSection } from "./SelectOptionsSection";
import { FacetConfigurationSection } from "./FacetConfigurationSection";

interface OptionGroup {
  id: string;
  group_name: string;
  options: string[];
}

interface AttributeDefinitionItemProps {
  index: number;
  fieldId: string;
  register: UseFormRegister<AttributeTemplateFormData>;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
  watch: UseFormWatch<AttributeTemplateFormData>;
  setValue: UseFormSetValue<AttributeTemplateFormData>;
  optionGroups: OptionGroup[];
  onRemove: (index: number) => void;
}

export const AttributeDefinitionItem = ({
  index,
  fieldId,
  register,
  control,
  errors,
  watch,
  setValue,
  optionGroups,
  onRemove,
}: AttributeDefinitionItemProps) => {
  return (
    <div key={fieldId} className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Attribute {index + 1}</h4>
        <Button
          variant="transparent"
          size="small"
          onClick={() => onRemove(index)}
          type="button"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>

      <AttributeConfigurationSection
        index={index}
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <SelectOptionsSection
        index={index}
        control={control}
        watch={watch}
        setValue={setValue}
        optionGroups={optionGroups}
      />

      <FacetConfigurationSection
        index={index}
        control={control}
        errors={errors}
        watch={watch}
        register={register}
      />
    </div>
  );
};
