import { Input, Label, Switch, Textarea } from "@medusajs/ui";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useEffect } from "react";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";

interface BasicInformationSectionProps {
  register: UseFormRegister<AttributeTemplateFormData>;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
  setValue: UseFormSetValue<AttributeTemplateFormData>;
  watch: UseFormWatch<AttributeTemplateFormData>;
}

const generateCodeFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
};

export const BasicInformationSection = ({
  register,
  control,
  errors,
  setValue,
  watch,
}: BasicInformationSectionProps) => {
  const templateName = watch("name");

  useEffect(() => {
    if (templateName) {
      const generatedCode = generateCodeFromName(templateName);
      setValue("code", generatedCode);
    }
  }, [templateName, setValue]);
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            Template Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., Camera Attributes"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Code will be auto-generated: {templateName ? generateCodeFromName(templateName) : 'e.g., camera_attributes'}
          </p>
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
  );
};
