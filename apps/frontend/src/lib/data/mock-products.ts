import { HttpTypes } from "@medusajs/types"

export const mockProducts: HttpTypes.StoreProduct[] = [
  {
    id: "prod_01",
    title: "Canon EOS R5",
    handle: "canon-eos-r5",
    description: "Professional full-frame mirrorless camera with 45MP sensor and 8K video recording",
    subtitle: "45MP Full-Frame Mirrorless",
    thumbnail: "https://images.unsplash.com/photo-1606986628253-05620e9b0a80?w=400",
    variants: [
      {
        id: "var_01",
        title: "Body Only",
        sku: "CANON-R5-BODY",
        calculated_price: {
          calculated_amount: 389900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 5
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "mirrorless" }, { value: "professional" }],
    metadata: {
      brand: "Canon",
      sensor_size: "Full Frame",
      megapixels: "45",
      video_capability: "8K"
    }
  },
  {
    id: "prod_02",
    title: "Sony α7 IV",
    handle: "sony-a7-iv",
    description: "Hybrid full-frame camera perfect for both photo and video creators",
    subtitle: "33MP Full-Frame Mirrorless",
    thumbnail: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400",
    variants: [
      {
        id: "var_02",
        title: "Body Only",
        sku: "SONY-A7IV-BODY",
        calculated_price: {
          calculated_amount: 249800,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 8
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "mirrorless" }, { value: "hybrid" }],
    metadata: {
      brand: "Sony",
      sensor_size: "Full Frame",
      megapixels: "33",
      video_capability: "4K 60fps"
    }
  },
  {
    id: "prod_03",
    title: "Nikon Z9",
    handle: "nikon-z9",
    description: "Flagship mirrorless camera with 45.7MP stacked CMOS sensor",
    subtitle: "45.7MP Full-Frame Mirrorless",
    thumbnail: "https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400",
    variants: [
      {
        id: "var_03",
        title: "Body Only",
        sku: "NIKON-Z9-BODY",
        calculated_price: {
          calculated_amount: 549900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 3
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "mirrorless" }, { value: "professional" }],
    metadata: {
      brand: "Nikon",
      sensor_size: "Full Frame",
      megapixels: "45.7",
      video_capability: "8K 30fps"
    }
  },
  {
    id: "prod_04",
    title: "Fujifilm X-T5",
    handle: "fujifilm-x-t5",
    description: "Compact APS-C camera with classic design and film simulations",
    subtitle: "40MP APS-C Mirrorless",
    thumbnail: "https://images.unsplash.com/photo-1491796014055-e6835cdcd4c6?w=400",
    variants: [
      {
        id: "var_04",
        title: "Body Only",
        sku: "FUJI-XT5-BODY",
        calculated_price: {
          calculated_amount: 169900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 12
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "mirrorless" }, { value: "compact" }],
    metadata: {
      brand: "Fujifilm",
      sensor_size: "APS-C",
      megapixels: "40",
      video_capability: "6.2K"
    }
  },
  {
    id: "prod_05",
    title: "Canon RF 24-70mm f/2.8L",
    handle: "canon-rf-24-70mm",
    description: "Professional standard zoom lens for Canon RF mount",
    subtitle: "24-70mm f/2.8 Zoom Lens",
    thumbnail: "https://images.unsplash.com/photo-1617638924421-92d5178a3caa?w=400",
    variants: [
      {
        id: "var_05",
        title: "Standard",
        sku: "CANON-RF2470-28",
        calculated_price: {
          calculated_amount: 229900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 7
      } as any
    ],
    categories: [{ id: "cat_lenses", name: "Lenses", handle: "lenses" }],
    tags: [{ value: "zoom" }, { value: "professional" }],
    metadata: {
      brand: "Canon",
      mount_type: "Canon RF",
      focal_length: "24-70mm",
      max_aperture: "f/2.8"
    }
  },
  {
    id: "prod_06",
    title: "Sony FE 85mm f/1.4 GM",
    handle: "sony-fe-85mm",
    description: "Premium portrait lens with beautiful bokeh",
    subtitle: "85mm f/1.4 Prime Lens",
    thumbnail: "https://images.unsplash.com/photo-1606986628253-05620e9b0a80?w=400",
    variants: [
      {
        id: "var_06",
        title: "Standard",
        sku: "SONY-FE85-14",
        calculated_price: {
          calculated_amount: 179900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 6
      } as any
    ],
    categories: [{ id: "cat_lenses", name: "Lenses", handle: "lenses" }],
    tags: [{ value: "prime" }, { value: "portrait" }],
    metadata: {
      brand: "Sony",
      mount_type: "Sony E",
      focal_length: "85mm",
      max_aperture: "f/1.4"
    }
  },
  {
    id: "prod_07",
    title: "Peak Design Travel Tripod",
    handle: "peak-design-travel-tripod",
    description: "Ultra-portable carbon fiber tripod for travelers",
    subtitle: "Carbon Fiber Travel Tripod",
    thumbnail: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
    variants: [
      {
        id: "var_07",
        title: "Carbon Fiber",
        sku: "PD-TRIPOD-CF",
        calculated_price: {
          calculated_amount: 64995,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 15
      } as any
    ],
    categories: [{ id: "cat_accessories", name: "Accessories", handle: "accessories" }],
    tags: [{ value: "tripod" }, { value: "travel" }],
    metadata: {
      brand: "Peak Design",
      material: "Carbon Fiber",
      max_height: "153cm",
      weight: "1.29kg"
    }
  },
  {
    id: "prod_08",
    title: "SanDisk Extreme Pro 128GB",
    handle: "sandisk-extreme-pro-128gb",
    description: "High-speed SDXC memory card for 4K video recording",
    subtitle: "128GB UHS-II SD Card",
    thumbnail: "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=400",
    variants: [
      {
        id: "var_08",
        title: "128GB",
        sku: "SD-EXPRO-128",
        calculated_price: {
          calculated_amount: 12999,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 50
      } as any
    ],
    categories: [{ id: "cat_accessories", name: "Accessories", handle: "accessories" }],
    tags: [{ value: "memory-card" }, { value: "storage" }],
    metadata: {
      brand: "SanDisk",
      capacity: "128GB",
      speed_class: "UHS-II",
      read_speed: "300MB/s"
    }
  },
  {
    id: "prod_09",
    title: "Olympus OM-1",
    handle: "olympus-om-1",
    description: "Weather-sealed micro four thirds camera with advanced stabilization",
    subtitle: "20MP Micro Four Thirds",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    variants: [
      {
        id: "var_09",
        title: "Body Only",
        sku: "OLYMPUS-OM1-BODY",
        calculated_price: {
          calculated_amount: 219900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 9
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "mirrorless" }, { value: "weather-sealed" }],
    metadata: {
      brand: "Olympus",
      sensor_size: "Micro Four Thirds",
      megapixels: "20",
      video_capability: "4K 60fps"
    }
  },
  {
    id: "prod_10",
    title: "Panasonic Lumix S5 II",
    handle: "panasonic-lumix-s5-ii",
    description: "Full-frame hybrid camera with phase detection autofocus",
    subtitle: "24MP Full-Frame Mirrorless",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    variants: [
      {
        id: "var_10",
        title: "Body Only",
        sku: "LUMIX-S5II-BODY",
        calculated_price: {
          calculated_amount: 199900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 11
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "mirrorless" }, { value: "hybrid" }],
    metadata: {
      brand: "Panasonic",
      sensor_size: "Full Frame",
      megapixels: "24",
      video_capability: "6K"
    }
  },
  {
    id: "prod_11",
    title: "Nikon Z 70-200mm f/2.8",
    handle: "nikon-z-70-200mm",
    description: "Professional telephoto zoom lens for Nikon Z mount",
    subtitle: "70-200mm f/2.8 Telephoto",
    thumbnail: "https://images.unsplash.com/photo-1617638924421-92d5178a3caa?w=400",
    variants: [
      {
        id: "var_11",
        title: "Standard",
        sku: "NIKON-Z70200-28",
        calculated_price: {
          calculated_amount: 269900,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 4
      } as any
    ],
    categories: [{ id: "cat_lenses", name: "Lenses", handle: "lenses" }],
    tags: [{ value: "zoom" }, { value: "telephoto" }],
    metadata: {
      brand: "Nikon",
      mount_type: "Nikon Z",
      focal_length: "70-200mm",
      max_aperture: "f/2.8"
    }
  },
  {
    id: "prod_12",
    title: "Leica Q3",
    handle: "leica-q3",
    description: "Premium compact camera with fixed 28mm f/1.7 lens",
    subtitle: "60MP Full-Frame Compact",
    thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    variants: [
      {
        id: "var_12",
        title: "Standard",
        sku: "LEICA-Q3",
        calculated_price: {
          calculated_amount: 599500,
          currency_code: "usd",
          is_calculated_price_tax_inclusive: false
        },
        inventory_quantity: 2
      } as any
    ],
    categories: [{ id: "cat_cameras", name: "Cameras", handle: "cameras" }],
    tags: [{ value: "compact" }, { value: "premium" }],
    metadata: {
      brand: "Leica",
      sensor_size: "Full Frame",
      megapixels: "60",
      video_capability: "8K"
    }
  }
]

export function getMockProductsByCategory(categoryHandle: string): HttpTypes.StoreProduct[] {
  const categoryMap: Record<string, string[]> = {
    'cameras': ['prod_01', 'prod_02', 'prod_03', 'prod_04', 'prod_09', 'prod_10', 'prod_12'],
    'may-anh': ['prod_01', 'prod_02', 'prod_03', 'prod_04', 'prod_09', 'prod_10', 'prod_12'],
    'lenses': ['prod_05', 'prod_06', 'prod_11'],
    'ong-kinh': ['prod_05', 'prod_06', 'prod_11'],
    'accessories': ['prod_07', 'prod_08'],
    'phu-kien': ['prod_07', 'prod_08'],
    'dslr': ['prod_01', 'prod_03'],
    'may-anh-dslr': ['prod_01', 'prod_03'],
    'mirrorless': ['prod_01', 'prod_02', 'prod_03', 'prod_04', 'prod_09', 'prod_10'],
    'may-anh-mirrorless': ['prod_01', 'prod_02', 'prod_03', 'prod_04', 'prod_09', 'prod_10'],
    'compact': ['prod_12'],
    'may-anh-compact': ['prod_12'],
  }

  const productIds = categoryMap[categoryHandle] || []
  return mockProducts.filter(p => productIds.includes(p.id))
}

export function getAllMockProducts(): HttpTypes.StoreProduct[] {
  return mockProducts
}