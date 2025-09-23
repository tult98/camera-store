"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lensAttributeData = exports.cameraAttributeData = void 0;
exports.cameraAttributeData = [
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
];
exports.lensAttributeData = [
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
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1hdHRyaWJ1dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZGF0YS9wcm9kdWN0LWF0dHJpYnV0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxtQkFBbUIsR0FBRztJQUNqQztRQUNFLGFBQWEsRUFBRSxpQkFBaUI7UUFDaEMsVUFBVSxFQUFFO1lBQ1YsS0FBSyxFQUFFLFVBQVU7WUFDakIsV0FBVyxFQUFFLE9BQU87WUFDcEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsZ0JBQWdCLEVBQUUsT0FBTztZQUN6QixlQUFlLEVBQUUsS0FBSztZQUN0QixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLElBQUksRUFBRSxJQUFJO1lBQ1YsU0FBUyxFQUFFLElBQUk7WUFDZixXQUFXLEVBQUUsSUFBSTtZQUNqQixlQUFlLEVBQUUsa0JBQWtCO1lBQ25DLGFBQWEsRUFBRSxHQUFHO1lBQ2xCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFFBQVEsRUFBRSxHQUFHO1lBQ2IsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQjtLQUNGO0lBQ0Q7UUFDRSxhQUFhLEVBQUUsY0FBYztRQUM3QixVQUFVLEVBQUU7WUFDVixLQUFLLEVBQUUsT0FBTztZQUNkLFdBQVcsRUFBRSxZQUFZO1lBQ3pCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsZ0JBQWdCLEVBQUUsT0FBTztZQUN6QixlQUFlLEVBQUUsSUFBSTtZQUNyQixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLElBQUksRUFBRSxJQUFJO1lBQ1YsU0FBUyxFQUFFLElBQUk7WUFDZixXQUFXLEVBQUUsSUFBSTtZQUNqQixlQUFlLEVBQUUsa0JBQWtCO1lBQ25DLGFBQWEsRUFBRSxHQUFHO1lBQ2xCLGFBQWEsRUFBRSxNQUFNO1lBQ3JCLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFFBQVEsRUFBRSxHQUFHO1lBQ2IsbUJB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