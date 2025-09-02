export const cameraAttributeData = [
  {
    productHandle: 'fujifilm-x100vi',
    attributes: {
      brand: 'Fujifilm',
      sensor_type: 'APS-C',
      resolution: 40.2,
      video_resolution: '4K60p',
      weather_sealing: false,
      image_stabilization: false,
      wifi: true,
      bluetooth: true,
      touchscreen: true,
      viewfinder_type: 'Hybrid (OVF/EVF)',
      iso_range_min: 160,
      iso_range_max: 51200,
      battery_life: 450,
      lcd_size: 3.0,
      articulating_screen: true
    }
  },
  {
    productHandle: 'canon-eos-r5',
    attributes: {
      brand: 'Canon',
      sensor_type: 'Full Frame',
      resolution: 45,
      video_resolution: '8K30p',
      weather_sealing: true,
      image_stabilization: true,
      wifi: true,
      bluetooth: true,
      touchscreen: true,
      viewfinder_type: 'Electronic (EVF)',
      iso_range_min: 100,
      iso_range_max: 102400,
      battery_life: 320,
      lcd_size: 3.2,
      articulating_screen: true
    }
  },
  {
    productHandle: 'sony-a7-iv',
    attributes: {
      brand: 'Sony',
      sensor_type: 'Full Frame',
      resolution: 33,
      video_resolution: '4K60p',
      weather_sealing: true,
      image_stabilization: true,
      wifi: true,
      bluetooth: true,
      touchscreen: true,
      viewfinder_type: 'Electronic (EVF)',
      iso_range_min: 100,
      iso_range_max: 204800,
      battery_life: 520,
      lcd_size: 3.0,
      articulating_screen: true
    }
  },
  {
    productHandle: 'gopro-hero-12-black',
    attributes: {
      brand: 'GoPro',
      sensor_type: '1/1.9-inch',
      resolution: 27,
      video_resolution: '4K120p',
      weather_sealing: true,
      image_stabilization: true,
      wifi: true,
      bluetooth: true,
      touchscreen: true,
      viewfinder_type: 'None',
      iso_range_min: 100,
      iso_range_max: 6400,
      battery_life: 70, // minutes for action cameras - different unit but for comparison
      lcd_size: 2.27,
      articulating_screen: false
    }
  },
  {
    productHandle: 'leica-m11',
    attributes: {
      brand: 'Leica',
      sensor_type: 'Full Frame',
      resolution: 60,
      video_resolution: 'No Video',
      weather_sealing: false,
      image_stabilization: false,
      wifi: true,
      bluetooth: true,
      touchscreen: true,
      viewfinder_type: 'Rangefinder',
      iso_range_min: 64,
      iso_range_max: 50000,
      battery_life: 1700,
      lcd_size: 3.0,
      articulating_screen: false
    }
  },
  {
    productHandle: 'fujifilm-instax-mini-12',
    attributes: {
      brand: 'Fujifilm',
      sensor_type: 'Medium Format',
      resolution: 0, // Instant camera doesn't have digital sensor
      video_resolution: 'No Video',
      weather_sealing: false,
      image_stabilization: false,
      wifi: false,
      bluetooth: false,
      touchscreen: false,
      viewfinder_type: 'None',
      iso_range_min: 800, // Fixed ISO for instant cameras
      iso_range_max: 800,
      battery_life: 100, // Approximate shots with AA batteries
      lcd_size: 0, // No LCD screen
      articulating_screen: false
    }
  }
]

export const lensAttributeData = [
  {
    productHandle: 'canon-rf-50mm-f1-2l-usm',
    attributes: {
      brand: 'Canon',
      lens_type: 'Prime',
      focal_length_min: 50,
      focal_length_max: 50,
      max_aperture: 'f/1.2',
      mount: 'Canon RF',
      weather_sealing: true,
      image_stabilization: false
    }
  },
  {
    productHandle: 'sony-fe-24-70mm-f2-8-gm-ii',
    attributes: {
      brand: 'Sony',
      lens_type: 'Zoom',
      focal_length_min: 24,
      focal_length_max: 70,
      max_aperture: 'f/2.8',
      mount: 'Sony E',
      weather_sealing: true,
      image_stabilization: true
    }
  }
]