import { Input, Label, Switch, Textarea } from "@medusajs/ui";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { AttributeTemplateFormData } from "../../schemas/attribute-template.schema";

interface BasicInformationSectionProps {
  register: UseFormRegister<AttributeTemplateFormData>;
  control: Control<AttributeTemplateFormData>;
  errors: FieldErrors<AttributeTemplateFormData>;
}

export const BasicInformationSection = ({
  register,
  control,
  errors,
}: BasicInformationSectionProps) => {
  return (
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
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
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
  );
};
