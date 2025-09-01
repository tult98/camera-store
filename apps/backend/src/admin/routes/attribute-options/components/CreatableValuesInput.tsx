import { XMarkIcon } from "@heroicons/react/20/solid";
import { Input, Label } from "@medusajs/ui";
import { useState } from "react";

type CreatableValuesInputProps = {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
};

export const CreatableValuesInput = ({
  values,
  onChange,
  label = "Values",
  placeholder = "Type value and press Enter",
}: CreatableValuesInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
      setInputValue("");
    }
  };

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((value) => value !== valueToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="mb-2"
      />

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((value) => (
            <div
              key={value}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() => removeValue(value)}
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-gray-300 transition-colors"
                aria-label={`Remove ${value}`}
              >
                <XMarkIcon className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {values.length === 0 && (
        <div className="text-ui-fg-muted text-sm mt-2">
          No values added yet. Type above and press Enter to add.
        </div>
      )}
    </div>
  );
};
