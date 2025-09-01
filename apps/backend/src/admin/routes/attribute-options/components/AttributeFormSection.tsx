import { Trash } from "@medusajs/icons"
import { Button, Input, Label } from "@medusajs/ui"
import { Control, Controller } from "react-hook-form"
import { CreatableValuesInput } from "./CreatableValuesInput"

type AttributeFormData = {
  group_name: string
  options: string[]
}

type AttributeFormSectionProps = {
  index: number
  control: Control<{ attributes: AttributeFormData[] }>
  onRemove: () => void
  showRemove: boolean
}

export const AttributeFormSection = ({
  index,
  control,
  onRemove,
  showRemove
}: AttributeFormSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Attribute {index + 1}</h3>
        {showRemove && (
          <Button
            type="button"
            variant="transparent" 
            size="small"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Attribute Name</Label>
          <Controller
            name={`attributes.${index}.group_name`}
            control={control}
            rules={{ required: "Attribute name is required" }}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="e.g., Camera Types"
                  className={fieldState.error ? "border-red-500" : ""}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Controller
            name={`attributes.${index}.options`}
            control={control}
            rules={{ 
              required: "At least one option is required",
              validate: (options) => options.length > 0 || "At least one option is required"
            }}
            render={({ field, fieldState }) => (
              <div>
                <CreatableValuesInput
                  values={field.value || []}
                  onChange={field.onChange}
                  label="Options"
                  placeholder="Type option and press Enter"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}