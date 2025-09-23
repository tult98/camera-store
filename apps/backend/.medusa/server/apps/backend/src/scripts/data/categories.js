"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubCategories = exports.productCategoriesData = void 0;
// Hero banner URLs for featured categories
const heroBanners = [
    "https://t3.ftcdn.net/jpg/02/85/88/92/360_F_285889262_szl55RvathIbWxUefP1WcZK1Fq1sY3sG.jpg",
    "https://i.pinimg.com/736x/67/e9/a0/67e9a0f56193f6af7ffc53c603a651a2.jpg",
    "https://t3.ftcdn.net/jpg/05/13/65/30/360_F_513653003_HulIdO3WaFBltQnCAXzPdPPovI8yNTdC.jpg",
    "https://t4.ftcdn.net/jpg/05/12/93/39/360_F_512933916_Wzr2Jw0EQYuWDDOJI9mT5buG7LEGpAeM.jpg",
];
exports.productCategoriesData = [
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
const generateSubCategories = ({ camerasCategory, lensesCategory, accessoriesCategory, audioVideoCategory, }) => {
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
exports.generateSubCategories = generateSubCategories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2RhdGEvY2F0ZWdvcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQ0FBMkM7QUFDM0MsTUFBTSxXQUFXLEdBQUc7SUFDbEIsMkZBQTJGO0lBQzNGLHlFQUF5RTtJQUN6RSwyRkFBMkY7SUFDM0YsMkZBQTJGO0NBQzVGLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHO0lBQ25DO1FBQ0UsSUFBSSxFQUFFLFNBQVM7UUFDZixTQUFTLEVBQUUsSUFBSTtRQUNmLFdBQVcsRUFBRSxnREFBZ0Q7UUFDN0QsTUFBTSxFQUFFLFNBQVM7UUFDakIsUUFBUSxFQUFFO1lBQ1IsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsV0FBVyxFQUFFLElBQUk7WUFDakIsYUFBYSxFQUFFLENBQUM7U0FDakI7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFLFFBQVE7UUFDZCxTQUFTLEVBQUUsSUFBSTtRQUNmLFdBQVcsRUFBRSxtQ0FBbUM7UUFDaEQsTUFBTSxFQUFFLFFBQVE7UUFDaEIsUUFBUSxFQUFFO1lBQ1IsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsV0FBVyxFQUFFLElBQUk7WUFDakIsYUFBYSxFQUFFLENBQUM7U0FDakI7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFLGFBQWE7UUFDbkIsU0FBUyxFQUFFLElBQUk7UUFDZixXQUFXLEVBQUUsa0NBQWtDO1FBQy9DLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLFFBQVEsRUFBRTtZQUNSLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzlCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLGFBQWEsRUFBRSxDQUFDO1NBQ2pCO0tBQ0Y7SUFDRDtRQUNFLElBQUksRUFBRSxlQUFlO1FBQ3JCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsV0FBVyxFQUFF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