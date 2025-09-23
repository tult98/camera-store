"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeTemplatesData = void 0;
exports.attributeTemplatesData = [
    {
        name: 'Camera Specifications',
        code: 'camera_specifications',
        description: 'Comprehensive specifications for digital cameras',
        attribute_definitions: [
            {
                key: 'brand',
                label: 'Brand',
                type: 'select',
                option_group: 'Camera Brands',
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
                label: 'Sensor Types',
                type: 'select',
                option_group: 'Sensor Types',
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
                    is_facet: false,
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
                option_group: 'Video Capabilities',
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
                option_group: 'Viewfinder Types',
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
                    is_facet: false,
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
                    is_facet: false,
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
                    is_facet: false,
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
                    is_facet: false,
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
                option_group: 'Lens Brands',
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
                option_group: 'Lens Types',
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
                option_group: 'Lens Mounts',
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
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLXRlbXBsYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2RhdGEvYXR0cmlidXRlLXRlbXBsYXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLHNCQUFzQixHQUFHO0lBQ3BDO1FBQ0UsSUFBSSxFQUFFLHVCQUF1QjtRQUM3QixJQUFJLEVBQUUsdUJBQXVCO1FBQzdCLFdBQVcsRUFBRSxrREFBa0Q7UUFDL0QscUJBQXFCLEVBQUU7WUFDckI7Z0JBQ0UsR0FBRyxFQUFFLE9BQU87Z0JBQ1osS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsWUFBWSxFQUFFLGVBQWU7Z0JBQzdCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixZQUFZLEVBQUU7b0JBQ1osUUFBUSxFQUFFLElBQUk7b0JBQ2QsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDbkIsZ0JBQWdCLEVBQUUsTUFBTTtvQkFDeEIsWUFBWSxFQUFFLFVBQVU7b0JBQ3hCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixXQUFXLEVBQUUsS0FBSztvQkFDbEIsaUJBQWlCLEVBQUUsS0FBSztvQkFDeEIsaUJBQWlCLEVBQUUsRUFBRTtpQkFDdEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGlCQUFpQixFQUFFLHNDQUFzQztvQkFDekQsYUFBYSxFQUFFLGlDQUFpQztpQkFDakQ7YUFDRjtZQUNEO2dCQUNFLEdBQUcsRUFBRSxhQUFhO2dCQUNsQixLQUFLLEVBQUUsY0FBYztnQkFDckIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsWUFBWSxFQUFFLGNBQWM7Z0JBQzVCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixZQUFZLEVBQUU7b0JBQ1osUUFBUSxFQUFFLElBQUk7b0JBQ2QsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDbkIsZ0JBQWdC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