import { TooltipIconProps } from "../components/tooltip-icon";

// Attribute configuration tooltips
export const ATTRIBUTE_TOOLTIPS: Record<string, Omit<TooltipIconProps, "color">> = {
  type: {
    content: "Controls how admins input data when editing products",
    examples: {
      select: "Dropdown with single selection",
      text: "Free text input field",
      number: "Numeric input with validation",
      boolean: "Toggle switch (yes/no)"
    }
  },
  
  display_order: {
    content: "Position of this field in the product editing form (1 = first)",
    examples: "Order 5 = appears 5th when editing a product"
  },
  
  required: {
    content: "Whether admins must fill this field when creating products",
    note: "Required fields show * in product forms"
  },
  
  options: {
    content: "Predefined choices for select-type attributes",
    note: "Used for dropdown options in product editing"
  },
  
  validation: {
    content: "Rules for validating admin input",
    examples: "Min/max values, regex patterns, required rules"
  }
};

// Facet configuration tooltips
export const FACET_TOOLTIPS: Record<string, Omit<TooltipIconProps, "color">> = {
  is_facet: {
    content: "Enable to show this attribute as a customer filter",
    guidance: "Not all attributes make good filters (e.g., serial numbers, detailed descriptions)"
  },
  
  display_priority: {
    content: "Order of this filter in customer filter sidebar (1 = top)",
    comparison: "Different from 'Display Order' which affects product editing",
    examples: "Priority 1 = appears first in filters, even if display order is 10"
  },
  
  aggregation_type: {
    content: "How values are grouped for filtering",
    examples: {
      term: "Exact matches (Canon, Nikon, Sony)",
      range: "Numeric buckets (10-20 MP, 20-30 MP)",
      histogram: "Evenly-spaced intervals ($0-500, $500-1000)",
      boolean: "Yes/No toggle filters"
    }
  },
  
  display_type: {
    content: "How customers interact with this filter",
    comparison: "Can differ from attribute 'Type' field",
    examples: {
      checkbox: "Multiple selections allowed",
      radio: "Single selection only", 
      slider: "Range selection with handles",
      dropdown: "Searchable select menu",
      toggle: "On/off switch"
    }
  },
  
  show_count: {
    content: "Display product count next to each filter option",
    examples: "Canon (25), Nikon (18), Sony (12)"
  },
  
  collapsible: {
    content: "Allow customers to collapse/expand this filter section",
    guidance: "Useful for filters with many options"
  },
  
  searchable: {
    content: "Add a search box to filter options within this facet",
    guidance: "Recommended for facets with 10+ options"
  },
  
  max_display_items: {
    content: "Show 'See more' button after this many options",
    examples: "Setting 5 shows first 5 options, then 'Show more' button"
  }
};