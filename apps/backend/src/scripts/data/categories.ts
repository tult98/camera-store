import { ProductCategoryDTO } from "@medusajs/types";

// Hero banner URLs for featured categories
const heroBanners = [
  "https://t3.ftcdn.net/jpg/02/85/88/92/360_F_285889262_szl55RvathIbWxUefP1WcZK1Fq1sY3sG.jpg",
  "https://i.pinimg.com/736x/67/e9/a0/67e9a0f56193f6af7ffc53c603a651a2.jpg",
  "https://t3.ftcdn.net/jpg/05/13/65/30/360_F_513653003_HulIdO3WaFBltQnCAXzPdPPovI8yNTdC.jpg",
  "https://t4.ftcdn.net/jpg/05/12/93/39/360_F_512933916_Wzr2Jw0EQYuWDDOJI9mT5buG7LEGpAeM.jpg",
];

export const productCategoriesData = [
  {
    name: "Cameras",
    is_active: true,
    description: "Digital cameras for all your photography needs",
    handle: "cameras",
    metadata: {
      hero_image_url: heroBanners[0],
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
      hero_image_url: heroBanners[1],
      is_featured: true,
      display_order: 1,
    },
  },
  {
    name: "Accessories",
    is_active: true,
    description: "Photography accessories and gear",
    handle: "accessories",
    metadata: {
      hero_image_url: heroBanners[2],
      is_featured: true,
      display_order: 2,
    },
  },
  {
    name: "Audio & Video",
    is_active: true,
    description: "Microphones and video accessories",
    handle: "audio-video",
  },
];

export const generateSubCategories = ({
  camerasCategory,
  lensesCategory,
  accessoriesCategory,
  audioVideoCategory,
}: {
  camerasCategory: ProductCategoryDTO;
  lensesCategory: ProductCategoryDTO;
  accessoriesCategory: ProductCategoryDTO;
  audioVideoCategory: ProductCategoryDTO;
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
    // Accessory subcategories
    {
      name: "Tripods & Supports",
      is_active: true,
      description: "Camera stabilization equipment",
      parent_category_id: accessoriesCategory?.id || null,
      handle: "tripods-supports",
    },
    {
      name: "Bags & Cases",
      is_active: true,
      description: "Camera storage and protection solutions",
      parent_category_id: accessoriesCategory?.id || null,
      handle: "bags-cases",
    },
    {
      name: "Filters",
      is_active: true,
      description: "Lens filters and accessories",
      parent_category_id: accessoriesCategory?.id || null,
      handle: "filters",
    },
    {
      name: "Batteries & Chargers",
      is_active: true,
      description: "Power accessories for cameras",
      parent_category_id: accessoriesCategory?.id || null,
      handle: "batteries-chargers",
    },
    {
      name: "Memory Cards",
      is_active: true,
      description: "Storage solutions for digital cameras",
      parent_category_id: accessoriesCategory?.id || null,
      handle: "memory-cards",
    },
    {
      name: "Lighting & Flashes",
      is_active: true,
      description: "Studio and portable lighting equipment",
      parent_category_id: accessoriesCategory?.id || null,
      handle: "lighting-flashes",
    },
    // Audio & Video subcategories
    {
      name: "Microphones",
      is_active: true,
      description: "External microphones for cameras",
      parent_category_id: audioVideoCategory?.id || null,
      handle: "microphones",
    },
    {
      name: "Video Accessories",
      is_active: true,
      description: "Accessories for video recording",
      parent_category_id: audioVideoCategory?.id || null,
      handle: "video-accessories",
    },
  ];
};
