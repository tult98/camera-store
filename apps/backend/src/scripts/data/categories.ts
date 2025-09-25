import { ProductCategoryDTO } from "@medusajs/types";

export const productCategoriesData = [
  {
    name: "Cameras",
    is_active: true,
    description: "Digital cameras for all your photography needs",
    handle: "cameras",
    metadata: {
      is_featured: true,
      display_order: 0,
    },
  },
  {
    name: "Lenses",
    is_active: true,
    description: "Camera lenses for all mount types",
    handle: "lenses",
    metadata: {
      is_featured: true,
      display_order: 1,
    },
  },
];

export const generateSubCategories = ({
  camerasCategory,
  lensesCategory,
}: {
  camerasCategory: ProductCategoryDTO;
  lensesCategory: ProductCategoryDTO;
}) => {
  return [
    // Camera subcategories
    {
      name: "DSLR Cameras",
      is_active: true,
      description: "Digital single-lens reflex cameras",
      parent_category_id: camerasCategory?.id || null,
      handle: "dslr-cameras",
    },
    {
      name: "Mirrorless Cameras",
      is_active: true,
      description: "Compact mirrorless camera systems",
      parent_category_id: camerasCategory?.id || null,
      handle: "mirrorless-cameras",
    },
    {
      name: "Instant Cameras",
      is_active: true,
      description: "Instant print and film cameras",
      parent_category_id: camerasCategory?.id || null,
      handle: "instant-cameras",
    },
    {
      name: "Action Cameras",
      is_active: true,
      description: "Compact cameras for sports and adventure",
      parent_category_id: camerasCategory?.id || null,
      handle: "action-cameras",
    },
    {
      name: "Film Cameras",
      is_active: true,
      description: "35mm and medium format film cameras",
      parent_category_id: camerasCategory?.id || null,
      handle: "film-cameras",
    },
    // Lens subcategories
    {
      name: "Prime Lenses",
      is_active: true,
      description: "Lenses with a fixed focal length",
      parent_category_id: lensesCategory?.id || null,
      handle: "prime-lenses",
    },
    {
      name: "Zoom Lenses",
      is_active: true,
      description: "Lenses with a variable focal length",
      parent_category_id: lensesCategory?.id || null,
      handle: "zoom-lenses",
    },
    {
      name: "Macro Lenses",
      is_active: true,
      description: "Lenses for close-up photography",
      parent_category_id: lensesCategory?.id || null,
      handle: "macro-lenses",
    },
    {
      name: "Telephoto Lenses",
      is_active: true,
      description: "Lenses with a long focal length",
      parent_category_id: lensesCategory?.id || null,
      handle: "telephoto-lenses",
    },
  ];
};
