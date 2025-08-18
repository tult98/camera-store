import { HttpTypes } from "@medusajs/types"
import { CheckIcon } from "@heroicons/react/24/outline"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const options = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-medium text-base-content">
        Chọn {title}
      </span>
      
      <div className="flex flex-wrap gap-3" data-testid={dataTestId}>
        {options.map((value) => {
          const isSelected = value === current
          
          return (
            <button
              key={value}
              onClick={() => updateOption(option.id, value)}
              className={`btn btn-outline text-sm px-6 py-2 h-auto min-h-0 w-fit relative font-normal ${
                isSelected ? "btn-primary border-primary" : "border-base-300"
              }`}
              disabled={disabled}
              data-testid="option-button"
            >
              {value}
              {isSelected && (
                <>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-b-[16px] border-b-primary" />
                  <CheckIcon className="absolute bottom-[1px] right-[1px] w-2 h-2 text-white" />
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
