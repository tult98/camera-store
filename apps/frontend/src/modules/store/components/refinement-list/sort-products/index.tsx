"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        Sort by
      </div>
      <div className="collapse-content">
        <div className="space-y-2" {...(dataTestId && { "data-testid": dataTestId })}>
          {sortOptions.map((option) => (
            <label 
              key={option.value} 
              className="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 rounded"
            >
              <input
                type="radio"
                name="sortBy"
                className="radio radio-sm radio-primary"
                checked={sortBy === option.value}
                onChange={() => handleChange(option.value as SortOptions)}
              />
              <span className="text-sm flex-1">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SortProducts
