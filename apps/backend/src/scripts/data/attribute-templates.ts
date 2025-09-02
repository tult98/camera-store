export const attributeTemplatesData = [
  {
    name: 'Camera Specifications',
    code: 'camera_specifications',
    description: 'Comprehensive specifications for digital cameras',
    attribute_definitions: [
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        option_group: 'camera_brands',
        required: true,
        display_order: 1,
        facet_config: {
          is_facet: true,
          display_priority: 2,
          aggregation_type: 'term',
          display_type: 'checkbox',
          show_count: true,
          collapsible: false,
          initial_collapsed: false,
          max_display_items: 10
        },
        tooltip: {
          attribute_tooltip: 'The manufacturer brand of the camera',
          facet_tooltip: 'Filter products by camera brand'
        }
      },
      {
        key: 'sensor_type',
        label: 'Sensor Format',
        type: 'select',
        option_group: 'sensor_types',
        required: true,
        display_order: 2,
        facet_config: {
          is_facet: true,
          display_priority: 3,
          aggregation_type: 'term',
          display_type: 'radio',
          show_count: true,
          collapsible: false
        },
        tooltip: {
          attribute_tooltip: 'The physical size/format of the camera sensor',
          facet_tooltip: 'Filter by sensor format size'
        }
      },
      {
        key: 'resolution',
        label: 'Resolution (MP)',
        type: 'number',
        required: true,
        display_order: 3,
        unit: 'MP',
        validation: {
          rules: ['positive'],
          min: 1,
          max: 150
        },
        facet_config: {
          is_facet: true,
          display_priority: 4,
          aggregation_type: 'range',
          display_type: 'slider',
          show_count: false,
          range_config: {
            min: 10,
            max: 100,
            step: 5,
            buckets: [
              { min: 10, max: 24, label: '10-24 MP' },
              { min: 24, max: 40, label: '24-40 MP' },
              { min: 40, max: 60, label: '40-60 MP' },
              { min: 60, max: null, label: '60+ MP' }
            ]
          }
        },
        tooltip: {
          attribute_tooltip: 'Megapixel count of the camera sensor',
          facet_tooltip: 'Filter by resolution range'
        }
      },
      {
        key: 'video_resolution',
        label: 'Video Capability',
        type: 'select',
        option_group: 'video_capabilities',
        required: false,
        display_order: 4,
        facet_config: {
          is_facet: true,
          display_priority: 5,
          aggregation_type: 'term',
          display_type: 'checkbox',
          show_count: true,
          max_display_items: 6
        }
      },
      {
        key: 'weather_sealing',
        label: 'Weather Sealing',
        type: 'boolean',
        required: false,
        display_order: 5,
        facet_config: {
          is_facet: true,
          display_priority: 6,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'image_stabilization',
        label: 'Image Stabilization',
        type: 'boolean',
        required: false,
        display_order: 6,
        facet_config: {
          is_facet: true,
          display_priority: 7,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'wifi',
        label: 'WiFi',
        type: 'boolean',
        required: false,
        display_order: 7,
        facet_config: {
          is_facet: true,
          display_priority: 8,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'bluetooth',
        label: 'Bluetooth',
        type: 'boolean',
        required: false,
        display_order: 8,
        facet_config: {
          is_facet: true,
          display_priority: 9,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'touchscreen',
        label: 'Touchscreen LCD',
        type: 'boolean',
        required: false,
        display_order: 9,
        facet_config: {
          is_facet: true,
          display_priority: 10,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'viewfinder_type',
        label: 'Viewfinder Type',
        type: 'select',
        option_group: 'viewfinder_types',
        required: false,
        display_order: 10,
        facet_config: {
          is_facet: true,
          display_priority: 11,
          aggregation_type: 'term',
          display_type: 'radio',
          show_count: true
        }
      },
      {
        key: 'iso_range_min',
        label: 'ISO Range (Min)',
        type: 'number',
        required: false,
        display_order: 11,
        validation: {
          rules: ['positive'],
          min: 25,
          max: 12800
        },
        facet_config: {
          is_facet: true,
          display_priority: 12,
          aggregation_type: 'range',
          display_type: 'slider',
          range_config: {
            min: 50,
            max: 12800,
            step: 50
          }
        }
      },
      {
        key: 'iso_range_max',
        label: 'ISO Range (Max)',
        type: 'number',
        required: false,
        display_order: 12,
        validation: {
          rules: ['positive'],
          min: 100,
          max: 409600
        }
      },
      {
        key: 'battery_life',
        label: 'Battery Life (shots)',
        type: 'number',
        required: false,
        display_order: 13,
        unit: 'shots',
        validation: {
          rules: ['positive'],
          min: 100,
          max: 3000
        },
        facet_config: {
          is_facet: true,
          display_priority: 13,
          aggregation_type: 'range',
          display_type: 'slider',
          range_config: {
            min: 200,
            max: 2000,
            step: 100,
            buckets: [
              { min: 200, max: 500, label: '200-500 shots' },
              { min: 500, max: 1000, label: '500-1000 shots' },
              { min: 1000, max: 1500, label: '1000-1500 shots' },
              { min: 1500, max: null, label: '1500+ shots' }
            ]
          }
        }
      },
      {
        key: 'lcd_size',
        label: 'LCD Screen Size',
        type: 'number',
        required: false,
        display_order: 14,
        unit: 'inches',
        validation: {
          rules: ['positive'],
          min: 2.0,
          max: 4.0
        },
        facet_config: {
          is_facet: true,
          display_priority: 14,
          aggregation_type: 'term',
          display_type: 'checkbox',
          show_count: true
        }
      },
      {
        key: 'articulating_screen',
        label: 'Articulating Screen',
        type: 'boolean',
        required: false,
        display_order: 15,
        facet_config: {
          is_facet: true,
          display_priority: 15,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'weight',
        label: 'Weight',
        type: 'text',
        required: false,
        display_order: 16,
        placeholder: 'e.g., 521g (body only)',
        tooltip: {
          attribute_tooltip: 'Weight of the camera including battery and memory card'
        }
      }
    ],
    is_active: true
  },
  {
    name: 'Lens Specifications',
    code: 'lens_specifications',
    description: 'Comprehensive specifications for camera lenses',
    attribute_definitions: [
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        option_group: 'lens_brands',
        required: true,
        display_order: 1,
        facet_config: {
          is_facet: true,
          display_priority: 2,
          aggregation_type: 'term',
          display_type: 'checkbox',
          show_count: true,
          collapsible: false
        }
      },
      {
        key: 'lens_type',
        label: 'Lens Type',
        type: 'select',
        option_group: 'lens_types',
        required: true,
        display_order: 2,
        facet_config: {
          is_facet: true,
          display_priority: 3,
          aggregation_type: 'term',
          display_type: 'radio',
          show_count: true
        }
      },
      {
        key: 'focal_length_min',
        label: 'Min Focal Length (mm)',
        type: 'number',
        required: true,
        display_order: 3,
        unit: 'mm',
        validation: {
          rules: ['positive'],
          min: 1,
          max: 2000
        },
        facet_config: {
          is_facet: true,
          display_priority: 4,
          aggregation_type: 'range',
          display_type: 'slider',
          range_config: {
            min: 10,
            max: 600,
            step: 10
          }
        }
      },
      {
        key: 'focal_length_max',
        label: 'Max Focal Length (mm)',
        type: 'number',
        required: false,
        display_order: 4,
        unit: 'mm',
        validation: {
          rules: ['positive'],
          min: 1,
          max: 2000
        }
      },
      {
        key: 'max_aperture',
        label: 'Maximum Aperture',
        type: 'text',
        required: true,
        display_order: 5,
        validation: {
          regex: '^f\/[0-9]+(\.[0-9]+)?$'
        },
        facet_config: {
          is_facet: true,
          display_priority: 5,
          aggregation_type: 'term',
          display_type: 'checkbox',
          show_count: true
        }
      },
      {
        key: 'mount',
        label: 'Lens Mount',
        type: 'select',
        option_group: 'lens_mounts',
        required: true,
        display_order: 6,
        facet_config: {
          is_facet: true,
          display_priority: 6,
          aggregation_type: 'term',
          display_type: 'checkbox',
          show_count: true
        }
      },
      {
        key: 'weather_sealing',
        label: 'Weather Sealing',
        type: 'boolean',
        required: false,
        display_order: 7,
        facet_config: {
          is_facet: true,
          display_priority: 7,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'image_stabilization',
        label: 'Optical Stabilization',
        type: 'boolean',
        required: false,
        display_order: 8,
        facet_config: {
          is_facet: true,
          display_priority: 8,
          aggregation_type: 'boolean',
          display_type: 'toggle',
          show_count: true
        }
      },
      {
        key: 'weight',
        label: 'Weight',
        type: 'text',
        required: false,
        display_order: 9,
        placeholder: 'e.g., 1070g',
        tooltip: {
          attribute_tooltip: 'Weight of the lens'
        }
      }
    ],
    is_active: true
  }
]