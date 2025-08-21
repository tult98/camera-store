import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const categoryId = req.params.id
  const query = req.query as Record<string, string>

  const allProducts = [
    { brand: "sony", sensor_size: "full-frame", use_case: ["professional", "hybrid"], mount_type: "sony-e", video_resolution: "4k60", price: 2499.99, availability: "in-stock" },
    { brand: "canon", sensor_size: "full-frame", use_case: ["sports", "wildlife"], mount_type: "canon-rf", video_resolution: "4k60", price: 2499.00, availability: "in-stock" },
    { brand: "nikon", sensor_size: "full-frame", use_case: ["professional", "sports", "wildlife"], mount_type: "nikon-z", video_resolution: "8k30", price: 5499.95, availability: "in-stock" },
    { brand: "fujifilm", sensor_size: "aps-c", use_case: ["travel", "street", "vlogging"], mount_type: "fujifilm-x", video_resolution: "6k30", price: 1699.00, availability: "in-stock" },
    { brand: "sony", sensor_size: "aps-c", use_case: ["vlogging", "content-creation"], mount_type: "sony-e", video_resolution: "4k120", price: 1399.99, availability: "in-stock" },
    { brand: "canon", sensor_size: "aps-c", use_case: ["wildlife", "sports"], mount_type: "canon-rf", video_resolution: "4k60", price: 1499.00, availability: "in-stock" },
    { brand: "panasonic", sensor_size: "full-frame", use_case: ["video", "hybrid"], mount_type: "l-mount", video_resolution: "6k30", price: 1999.99, availability: "in-stock" },
    { brand: "om-system", sensor_size: "micro-four-thirds", use_case: ["wildlife", "adventure"], mount_type: "micro-four-thirds", video_resolution: "4k60", price: 2199.99, availability: "in-stock" },
    { brand: "sony", sensor_size: "full-frame", use_case: ["portrait", "wedding"], mount_type: "sony-e", video_resolution: "4k30", price: 3499.99, availability: "pre-order" },
    { brand: "canon", sensor_size: "full-frame", use_case: ["landscape", "travel"], mount_type: "canon-rf", video_resolution: "4k30", price: 1899.00, availability: "in-stock" },
    { brand: "nikon", sensor_size: "aps-c", use_case: ["beginner", "travel"], mount_type: "nikon-z", video_resolution: "4k30", price: 999.95, availability: "in-stock" },
    { brand: "fujifilm", sensor_size: "medium-format", use_case: ["professional", "studio"], mount_type: "fujifilm-gfx", video_resolution: "4k30", price: 4999.00, availability: "limited" },
  ]

  let filteredProducts = [...allProducts]

  Object.entries(query).forEach(([key, value]) => {
    if (key === 'sortBy' || key === 'page' || key === 'limit' || key === 'q') return

    if (key === 'price_min') {
      const minPrice = parseFloat(value)
      filteredProducts = filteredProducts.filter(p => p.price >= minPrice)
    } else if (key === 'price_max') {
      const maxPrice = parseFloat(value)
      filteredProducts = filteredProducts.filter(p => p.price <= maxPrice)
    } else {
      const values = value.split(',')
      if (key === 'use_case') {
        filteredProducts = filteredProducts.filter(p => 
          Array.isArray(p.use_case) && p.use_case.some(uc => values.includes(uc))
        )
      } else {
        filteredProducts = filteredProducts.filter(p => values.includes(p[key as keyof typeof p] as string))
      }
    }
  })

  const countOccurrences = (items: any[], field: string, value: string) => {
    if (field === 'use_case') {
      return items.filter(item => Array.isArray(item[field]) && item[field].includes(value)).length
    }
    return items.filter(item => item[field] === value).length
  }

  const getCountForValue = (field: string, value: string) => {
    const tempFiltered = [...allProducts]
    
    Object.entries(query).forEach(([key, queryValue]) => {
      if (key === field || key === 'sortBy' || key === 'page' || key === 'limit' || key === 'q') return
      
      if (key === 'price_min') {
        const minPrice = parseFloat(queryValue)
        tempFiltered.splice(0, tempFiltered.length, ...tempFiltered.filter(p => p.price >= minPrice))
      } else if (key === 'price_max') {
        const maxPrice = parseFloat(queryValue)
        tempFiltered.splice(0, tempFiltered.length, ...tempFiltered.filter(p => p.price <= maxPrice))
      } else {
        const values = queryValue.split(',')
        if (key === 'use_case') {
          tempFiltered.splice(0, tempFiltered.length, ...tempFiltered.filter(p => 
            Array.isArray(p.use_case) && p.use_case.some(uc => values.includes(uc))
          ))
        } else {
          tempFiltered.splice(0, tempFiltered.length, ...tempFiltered.filter(p => values.includes(p[key as keyof typeof p] as string)))
        }
      }
    })
    
    return countOccurrences(tempFiltered, field, value)
  }

  const facets = [
    {
      id: "use_case",
      label: "Use Case",
      type: "checkbox",
      options: [
        { value: "vlogging", label: "Good for Vlogging", count: getCountForValue("use_case", "vlogging") },
        { value: "sports", label: "Good for Sports", count: getCountForValue("use_case", "sports") },
        { value: "wildlife", label: "Good for Wildlife", count: getCountForValue("use_case", "wildlife") },
        { value: "portrait", label: "Good for Portraits", count: getCountForValue("use_case", "portrait") },
        { value: "landscape", label: "Good for Landscape", count: getCountForValue("use_case", "landscape") },
        { value: "travel", label: "Good for Travel", count: getCountForValue("use_case", "travel") },
        { value: "professional", label: "Professional", count: getCountForValue("use_case", "professional") },
        { value: "beginner", label: "Beginner Friendly", count: getCountForValue("use_case", "beginner") },
        { value: "video", label: "Video Focus", count: getCountForValue("use_case", "video") },
        { value: "hybrid", label: "Hybrid Shooter", count: getCountForValue("use_case", "hybrid") },
        { value: "content-creation", label: "Content Creation", count: getCountForValue("use_case", "content-creation") }
      ].filter(opt => opt.count > 0)
    },
    {
      id: "brand",
      label: "Brand",
      type: "checkbox",
      options: [
        { value: "sony", label: "Sony", count: getCountForValue("brand", "sony") },
        { value: "canon", label: "Canon", count: getCountForValue("brand", "canon") },
        { value: "nikon", label: "Nikon", count: getCountForValue("brand", "nikon") },
        { value: "fujifilm", label: "Fujifilm", count: getCountForValue("brand", "fujifilm") },
        { value: "panasonic", label: "Panasonic", count: getCountForValue("brand", "panasonic") },
        { value: "om-system", label: "OM System", count: getCountForValue("brand", "om-system") }
      ].filter(opt => opt.count > 0)
    },
    {
      id: "sensor_size",
      label: "Sensor Size",
      type: "checkbox",
      options: [
        { value: "full-frame", label: "Full-Frame", count: getCountForValue("sensor_size", "full-frame") },
        { value: "aps-c", label: "APS-C", count: getCountForValue("sensor_size", "aps-c") },
        { value: "micro-four-thirds", label: "Micro Four Thirds", count: getCountForValue("sensor_size", "micro-four-thirds") },
        { value: "medium-format", label: "Medium Format", count: getCountForValue("sensor_size", "medium-format") }
      ].filter(opt => opt.count > 0)
    },
    {
      id: "mount_type",
      label: "Mount Type",
      type: "checkbox",
      options: [
        { value: "sony-e", label: "Sony E", count: getCountForValue("mount_type", "sony-e") },
        { value: "canon-rf", label: "Canon RF", count: getCountForValue("mount_type", "canon-rf") },
        { value: "nikon-z", label: "Nikon Z", count: getCountForValue("mount_type", "nikon-z") },
        { value: "fujifilm-x", label: "Fujifilm X", count: getCountForValue("mount_type", "fujifilm-x") },
        { value: "fujifilm-gfx", label: "Fujifilm GFX", count: getCountForValue("mount_type", "fujifilm-gfx") },
        { value: "l-mount", label: "L-Mount", count: getCountForValue("mount_type", "l-mount") },
        { value: "micro-four-thirds", label: "Micro 4/3", count: getCountForValue("mount_type", "micro-four-thirds") }
      ].filter(opt => opt.count > 0)
    },
    {
      id: "video_resolution",
      label: "Video Resolution",
      type: "checkbox",
      options: [
        { value: "8k30", label: "8K 30p", count: getCountForValue("video_resolution", "8k30") },
        { value: "6k30", label: "6K 30p", count: getCountForValue("video_resolution", "6k30") },
        { value: "4k120", label: "4K 120p", count: getCountForValue("video_resolution", "4k120") },
        { value: "4k60", label: "4K 60p", count: getCountForValue("video_resolution", "4k60") },
        { value: "4k30", label: "4K 30p", count: getCountForValue("video_resolution", "4k30") }
      ].filter(opt => opt.count > 0)
    },
    {
      id: "availability",
      label: "Availability",
      type: "checkbox",
      options: [
        { value: "in-stock", label: "In Stock", count: getCountForValue("availability", "in-stock") },
        { value: "pre-order", label: "Pre-Order", count: getCountForValue("availability", "pre-order") },
        { value: "limited", label: "Limited Availability", count: getCountForValue("availability", "limited") }
      ].filter(opt => opt.count > 0)
    },
    {
      id: "price",
      label: "Price",
      type: "range",
      options: {
        min: Math.min(...filteredProducts.map(p => p.price)),
        max: Math.max(...filteredProducts.map(p => p.price))
      }
    }
  ]

  res.json({ facets })
}