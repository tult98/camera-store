import { ProductStatus } from "@medusajs/framework/utils";
import {
  ProductCategoryDTO,
  ProductTypeDTO,
  SalesChannelDTO,
  ShippingProfileDTO,
} from "@medusajs/types";

// Product image mapping - using curated camera-specific images
const productImages = {
  "fujifilm-x100vi": {
    thumbnail:
      "https://product.hstatic.net/200000354621/product/fujifilm-x100vi-8_83775f59e5d24883ab17813bb7aa4573_master.jpg",
    images: [
      "https://product.hstatic.net/1000234350/product/x100vi_black_1_ffe2e87abb9e402e9a5dda4af7b0af55_master.jpeg",
      "https://fujifilmshop.vn/wp-content/uploads/2024/08/may-anh-fujifilm-x100vi-7-1000x1000-1.jpg",
      "https://shopusa.fujifilm-x.com/media/catalog/product/1/6/16821822_PT14_Image_X100__top_Silver_4.jpg?quality=90&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
      "https://cdn.vjshop.vn/may-anh/compact/fujifilm/fujifilm-x100vi-limited-edition/fujifilm-x100vi-limited-edition-9-500x500.jpg",
    ],
  },
  "canon-eos-r5": {
    thumbnail:
      "https://product.hstatic.net/200000782117/product/canon_eos_r5_mark_ii__body-7_fb5bd2f64a3d450ca437717e02db96f3_master.jpg",
    images: [
      "https://product.hstatic.net/200000782117/product/canon_eos_r5_mark_ii__body_e9f1cda1e9444a7caad31eaa3516cf28_master.jpg",
      "https://images2.jessops.com/ce-images/PRODUCT/PRODUCT_ENLARGED/ACANOCM195365326_001.jpg?image=600",
      "https://img.photographyblog.com/reviews/canon_eos_r5/canon_eos_r5_01.jpg",
    ],
  },
  "sony-a7-iv": {
    thumbnail:
      "https://product.hstatic.net/200000782117/product/_mg_1061_1e909b0ed77c43dc9fb0660e8a2c448b_master.jpg",
    images: [
      "https://tokyocamera.vn/wp-content/uploads/2021/11/1634813170_1668836.jpg",
      "https://thecamerastore.com/cdn/shop/products/Sony-a7-IV-Body-03_1000x.jpg?v=1669310609",
      "https://tokyocamera.vn/wp-content/uploads/2021/11/1634813219_IMG_1627569.jpg",
    ],
  },
  "canon-rf-50mm-f1-2l-usm": {
    thumbnail:
      "https://tokyocamera.vn/wp-content/uploads/2021/04/Canon-RF-50mm-f1.2L-USM-3.jpg",
    images: [
      "https://giangduydat.vn/upload/rf%2050mm%20introduce%2001.jpg",
      "https://tokyocamera.vn/wp-content/uploads/2021/04/Canon-RF-50mm-f1.2L-USM-3.jpg",
    ],
  },
  "gopro-hero-12-black": {
    thumbnail:
      "https://product.hstatic.net/1000340975/product/gopro-hero-12-black-8-1-500x500_14d1098430e54689968762e6882e146b_master.jpg",
    images: [
      "https://product.hstatic.net/1000333506/product/camera-gopro-hero-12-black-5_62b72485fa4c4608965d06f95a8a23e7.jpg",
      "https://product.hstatic.net/1000333506/product/camera-gopro-hero-12-black-5_62b72485fa4c4608965d06f95a8a23e7.jpg",
    ],
  },
  "leica-m11": {
    thumbnail:
      "https://leicavietnam.com/store/product/images/detail/13036272/20208_Leica_M11_Monochrom_front_1024x1024.jpg",
    images: [
      "https://leicavietnam.com/store/product/images/detail/13036272/20208_Leica_M11_Monochrom_front_1024x1024.jpg",
      "https://leicavietnam.com/store/product/images/detail/13036272/20208_Leica_M11_Monochrom_right_1024x1024.jpg",
      "https://leicavietnam.com/store/product/images/detail/13036272/20208_Leica_M11_Monochrom_back_1024x1024__1_.jpg",
    ],
  },
  "fujifilm-instax-mini-12": {
    thumbnail:
      "https://product.hstatic.net/200000664119/product/analog_house_instax_mini_12_used_da_qua_su_dung_4f3e4b634bc04f22941c6582dd07e560.jpg",
    images: [
      "https://product.hstatic.net/200000664119/product/analog_house_instax_mini_12_used_da_qua_su_dung_4f3e4b634bc04f22941c6582dd07e560.jpg",
      "https://asset.fujifilm.com/www/vn/files/2023-03/ad008e20927a795f323f584689d317c6/thumb_mini12_01.png",
      "https://product.hstatic.net/200000409445/product/2_e7451886a27c4361981b06ecd1727542_master.jpg",
    ],
  },
  "sony-fe-24-70mm-f2-8-gm-ii": {
    thumbnail: "https://giangduydat.vn/product/sony-fe-24-70mm-f28-gm-ii.jpg",
    images: [
      "https://giangduydat.vn/product/sony-fe-24-70mm-f28-gm-ii.jpg",
      "https://cdn.vjshop.vn/ong-kinh/mirrorless/sony/sony-fe-24-70mm-f28-gm/sony-fe-24-70mm-f28-gm-lens1.jpg",
    ],
  },
};

export const generateProductsData = ({
  productTypeResult,
  categoryResult,
  shippingProfile,
  defaultSalesChannel,
}: {
  productTypeResult: ProductTypeDTO[];
  categoryResult: ProductCategoryDTO[];
  shippingProfile: ShippingProfileDTO;
  defaultSalesChannel: SalesChannelDTO[];
}) => {
  return [
    {
      title: "Fujifilm X100VI",
      type_id: productTypeResult.find((type) => type.value === "camera")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Mirrorless Cameras")!.id,
      ],
      description: `<h1>Fujifilm X100VI - The Ultimate Street Photography Companion</h1>

<h2><strong>Breakthrough Image Quality</strong></h2>
<p>Featuring the revolutionary <strong>40.2MP X-Trans™ CMOS 5 HR sensor</strong> paired with the blazing-fast <strong>X-Processor 5</strong>, the X100VI delivers exceptional image quality that rivals medium format cameras in a compact body.</p>

<h3>Key Features</h3>
<ul>
<li><strong>40.2MP Resolution</strong> - Capture every detail with stunning clarity</li>
<li><strong>In-Body Image Stabilization</strong> - Up to 6.0 stops of shake reduction</li>
<li><strong>Film Simulation Modes</strong> - 20 film simulations including new REALA ACE</li>
<li><strong>Subject Detection AF</strong> - Advanced AI-powered autofocus for humans, animals, birds, cars, and more</li>
</ul>

<h2><strong>Legendary 23mm f/2 Lens</strong></h2>
<p>The signature <strong>23mm f/2 FUJINON lens</strong> (35mm equivalent in full-frame) offers:</p>
<ul>
<li>Exceptional sharpness from edge to edge</li>
<li>Beautiful bokeh with 9-blade aperture</li>
<li>Built-in 4-stop ND filter for creative control</li>
<li>Close focusing to 10cm for versatile shooting</li>
</ul>

<h2><strong>Revolutionary Hybrid Viewfinder</strong></h2>
<p>Switch seamlessly between:</p>
<ul>
<li><strong>Optical Viewfinder (OVF)</strong> - See beyond the frame with parallax-corrected frame lines</li>
<li><strong>Electronic Viewfinder (EVF)</strong> - 3.69M-dot OLED with 0.66x magnification</li>
<li><strong>Electronic Range Finder (ERF)</strong> - Best of both worlds with picture-in-picture display</li>
</ul>

<h2><strong>Professional Performance</strong></h2>
<ul>
<li><strong>ISO 125-12800</strong> (expandable to 51200)</li>
<li><strong>425 AF points</strong> with phase detection</li>
<li><strong>11 fps continuous shooting</strong> with mechanical shutter</li>
<li><strong>4K/60p video</strong> with 6.2K oversampling</li>
<li><strong>Weather-resistant body</strong> when paired with AR-X100 adapter ring and PRF-49 filter</li>
</ul>

<h2><strong>Perfect For</strong></h2>
<ul>
<li>✓ Street Photography</li>
<li>✓ Travel & Documentary</li>
<li>✓ Everyday Carry</li>
<li>✓ Professional Backup Camera</li>
<li>✓ Creative Storytelling</li>
</ul>

<p><em>Experience the perfect blend of classic design and cutting-edge technology with the Fujifilm X100VI - where every shot tells a story.</em></p>`,
      handle: "fujifilm-x100vi",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["fujifilm-x100vi"].thumbnail,
      images: productImages["fujifilm-x100vi"].images.map((url) => ({
        url,
      })),
      options: [
        {
          title: "Color",
          values: ["Silver", "Black"],
        },
      ],
      variants: [
        {
          title: "Silver",
          sku: "FUJI-X100VI-SILVER",
          options: {
            Color: "Silver",
          },
          prices: [
            {
              amount: 3800000000, // 38,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Black",
          sku: "FUJI-X100VI-BLACK",
          options: {
            Color: "Black",
          },
          prices: [
            {
              amount: 3800000000, // 38,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "Canon EOS R5",
      type_id: productTypeResult.find((type) => type.value === "camera")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Mirrorless Cameras")!.id,
      ],
      description: `<h1>Canon EOS R5 - The Ultimate Hybrid Powerhouse</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Professional photographers</strong> demanding the highest image quality</li>
<li><strong>Wildlife & sports shooters</strong> needing blazing-fast autofocus</li>
<li><strong>Videographers</strong> looking for professional 8K RAW capabilities</li>
<li><strong>Wedding photographers</strong> requiring reliability and dual card slots</li>
</ul>

<h2>📸 Key Specifications</h2>

<h3>Sensor & Image Quality</h3>
<ul>
<li><strong>45 Megapixel</strong> Full-Frame CMOS sensor</li>
<li><strong>ISO Range</strong>: 100-51,200 (expandable to 50-102,400)</li>
<li><strong>14-bit RAW</strong> with Canon's latest DIGIC X processor</li>
<li><strong>Dual Pixel CMOS AF II</strong> with 1,053 AF points</li>
</ul>

<h3>Video Capabilities</h3>
<ul>
<li><strong>8K RAW</strong> internal recording at 30fps</li>
<li><strong>4K 120fps</strong> for stunning slow-motion</li>
<li><strong>Canon Log</strong> and <strong>HDR PQ</strong> support</li>
<li><strong>10-bit 4:2:2</strong> internal recording</li>
<li><strong>Unlimited recording</strong> time (with proper cooling)</li>
</ul>

<h3>Performance</h3>
<ul>
<li><strong>20 fps</strong> continuous shooting with electronic shutter</li>
<li><strong>12 fps</strong> with mechanical shutter</li>
<li><strong>5,940 selectable AF positions</strong></li>
<li><strong>100% viewfinder coverage</strong> with 5.76 million dots</li>
<li><strong>Animal Eye Detection AF</strong> for pets and wildlife</li>
</ul>

<h3>Stabilization & Build</h3>
<ul>
<li><strong>8-stops</strong> of in-body image stabilization (IBIS)</li>
<li><strong>Weather-sealed</strong> magnesium alloy body</li>
<li><strong>Dual card slots</strong>: CFexpress Type B + SD UHS-II</li>
<li><strong>3.2" vari-angle touchscreen</strong> with 2.1 million dots</li>
<li><strong>Built-in WiFi & Bluetooth</strong> connectivity</li>
</ul>

<h2>💡 Why Choose the EOS R5?</h2>

<p>The Canon EOS R5 represents the pinnacle of mirrorless technology, combining <strong>unprecedented resolution</strong> with <strong>blazing-fast performance</strong>. Its revolutionary 8K video capabilities open new creative possibilities, while the advanced autofocus system ensures you never miss a critical moment.</p>

<h3>Standout Features:</h3>
<ul>
<li>✅ <strong>Industry-leading autofocus</strong> with deep learning technology</li>
<li>✅ <strong>Professional video tools</strong> including waveforms and false color</li>
<li>✅ <strong>Exceptional low-light performance</strong> up to ISO 51,200</li>
<li>✅ <strong>Future-proof connectivity</strong> with 5GHz WiFi and USB 3.1</li>
<li>✅ <strong>Compatible with RF lenses</strong> - Canon's most advanced lens lineup</li>
</ul>

<h2>📦 What's Included</h2>
<ul>
<li>Canon EOS R5 Body</li>
<li>LP-E6NH Battery</li>
<li>Battery Charger LC-E6E</li>
<li>USB Interface Cable</li>
<li>Camera Strap</li>
<li>Cable Protector</li>
</ul>

<h2>🎖️ Awards & Recognition</h2>
<ul>
<li><strong>TIPA World Award 2021</strong> - Best Full Frame Professional Camera</li>
<li><strong>EISA Award</strong> - Professional Camera 2020-2021</li>
<li><strong>Camera of the Year</strong> - Multiple photography publications</li>
</ul>

<hr>

<p><em>Experience the future of imaging with the Canon EOS R5 - where <strong>innovation meets reliability</strong> for professionals who demand nothing but the best.</em></p>`,
      handle: "canon-eos-r5",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["canon-eos-r5"].thumbnail,
      images: productImages["canon-eos-r5"].images.map((url) => ({ url })),
      options: [
        {
          title: "Kit",
          values: ["Body only", "Kit with 24-105mm f/4L lens"],
        },
      ],
      variants: [
        {
          title: "Body only",
          sku: "CANON-R5-BODY",
          options: {
            Kit: "Body only",
          },
          prices: [
            {
              amount: 9500000000, // 95,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Kit with 24-105mm f/4L lens",
          sku: "CANON-R5-KIT-24-105",
          options: {
            Kit: "Kit with 24-105mm f/4L lens",
          },
          prices: [
            {
              amount: 12800000000, // 128,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "Sony A7 IV",
      type_id: productTypeResult.find((type) => type.value === "camera")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Mirrorless Cameras")!.id,
      ],
      description: `<h1>Sony A7 IV - The Perfect Balance of Resolution and Performance</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Hybrid shooters</strong> balancing photography and videography</li>
<li><strong>Content creators</strong> needing versatile 4K video capabilities</li>
<li><strong>Travel photographers</strong> seeking lightweight full-frame quality</li>
<li><strong>Portrait & wedding photographers</strong> requiring reliable autofocus</li>
<li><strong>Enthusiasts</strong> stepping up to professional-grade features</li>
</ul>

<h2>📸 Revolutionary Specifications</h2>

<h3>Image Quality & Sensor</h3>
<ul>
<li><strong>33 Megapixel</strong> Full-Frame Exmor R CMOS sensor</li>
<li><strong>ISO Range</strong>: 100-51,200 (expandable to 50-204,800)</li>
<li><strong>15+ stops</strong> of dynamic range for incredible detail</li>
<li><strong>Real-time Eye AF</strong> for humans, animals, and birds</li>
<li><strong>10-bit 4:2:2</strong> internal video recording</li>
</ul>

<h3>Advanced Autofocus System</h3>
<ul>
<li><strong>759 phase-detection points</strong> covering 94% of the frame</li>
<li><strong>Real-time tracking</strong> with AI-powered subject recognition</li>
<li><strong>Fast Hybrid AF</strong> locks onto subjects in just 0.06 seconds</li>
<li><strong>Touch Tracking</strong> for intuitive subject selection</li>
<li><strong>AF Assist Illuminator</strong> for low-light focusing</li>
</ul>

<h3>Video Capabilities</h3>
<ul>
<li><strong>4K 60fps</strong> internal recording without crop</li>
<li><strong>4K 120fps</strong> for stunning slow-motion footage</li>
<li><strong>S-Log3/S-Gamut3</strong> for professional color grading</li>
<li><strong>Active SteadyShot</strong> with 5.5-stops of stabilization</li>
<li><strong>Breathing Compensation</strong> for smooth focus transitions</li>
</ul>

<h3>Performance & Build</h3>
<ul>
<li><strong>10 fps continuous shooting</strong> with AF/AE tracking</li>
<li><strong>5.5-stops</strong> of 5-axis in-body image stabilization</li>
<li><strong>3.0" vari-angle touchscreen</strong> with 1.03 million dots</li>
<li><strong>Weather-sealed</strong> magnesium alloy construction</li>
<li><strong>Dual card slots</strong>: CFexpress Type A + SD UHS-II</li>
</ul>

<h2>💡 Why Choose the Sony A7 IV?</h2>

<p>The A7 IV represents Sony's commitment to <strong>versatility without compromise</strong>. Whether you're shooting stills or video, this camera adapts to your creative vision with <strong>class-leading autofocus</strong> and <strong>exceptional image quality</strong>.</p>

<h3>Standout Features:</h3>
<ul>
<li>✅ <strong>33MP resolution</strong> for detailed prints and cropping flexibility</li>
<li>✅ <strong>Professional video tools</strong> including waveforms and zebras</li>
<li>✅ <strong>Incredible low-light performance</strong> with clean high-ISO images</li>
<li>✅ <strong>Unlimited recording time</strong> for extended video sessions</li>
<li>✅ <strong>Compatible with 70+ FE lenses</strong> in Sony's ecosystem</li>
</ul>

<h2>📦 What's Included</h2>
<ul>
<li>Sony A7 IV Camera Body</li>
<li>NP-FZ100 Rechargeable Battery</li>
<li>AC Adaptor</li>
<li>Shoulder Strap</li>
<li>Body Cap</li>
<li>Accessory Shoe Cap</li>
<li>Eyepiece Cup</li>
<li>USB Cable</li>
</ul>

<h2>🎖️ Industry Recognition</h2>
<ul>
<li><strong>EISA Award</strong> - Hybrid Camera 2022-2023</li>
<li><strong>DPReview Choice Award</strong> - Best Hybrid Camera</li>
<li><strong>Imaging Resource</strong> - Highly Recommended</li>
</ul>

<hr>

<p><em>Discover the perfect fusion of <strong>resolution and performance</strong> with the Sony A7 IV - where every frame tells your story with unprecedented clarity and creative freedom.</em></p>`,
      handle: "sony-a7-iv",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["sony-a7-iv"].thumbnail,
      images: productImages["sony-a7-iv"].images.map((url) => ({ url })),
      options: [
        {
          title: "Kit",
          values: ["Body only", "Kit with FE 28-70mm f/3.5-5.6 OSS lens"],
        },
      ],
      variants: [
        {
          title: "Body only",
          sku: "SONY-A7IV-BODY",
          options: {
            Kit: "Body only",
          },
          prices: [
            {
              amount: 6200000000, // 62,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Kit with FE 28-70mm f/3.5-5.6 OSS lens",
          sku: "SONY-A7IV-KIT-28-70",
          options: {
            Kit: "Kit with FE 28-70mm f/3.5-5.6 OSS lens",
          },
          prices: [
            {
              amount: 7500000000, // 75,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "Canon RF 50mm f/1.2L USM",
      type_id: productTypeResult.find((type) => type.value === "lens")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Prime Lenses")!.id,
      ],
      description: `<h1>Canon RF 50mm f/1.2L USM - The Ultimate Portrait Lens</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Professional portraits</strong> requiring exceptional shallow depth of field</li>
<li><strong>Wedding photographers</strong> capturing intimate moments</li>
<li><strong>Street photographers</strong> seeking artistic bokeh</li>
<li><strong>Content creators</strong> demanding cinema-quality imagery</li>
<li><strong>Low-light specialists</strong> pushing creative boundaries</li>
</ul>

<h2>📸 Exceptional Optical Performance</h2>

<h3>Revolutionary f/1.2 Aperture</h3>
<ul>
<li><strong>Ultra-wide f/1.2 maximum aperture</strong> for stunning background separation</li>
<li><strong>12-blade rounded aperture</strong> creates perfectly circular bokeh</li>
<li><strong>Outstanding low-light performance</strong> for challenging conditions</li>
<li><strong>Artistic depth of field control</strong> for creative expression</li>
<li><strong>Beautiful subject isolation</strong> even in busy environments</li>
</ul>

<h3>Advanced Optical Design</h3>
<ul>
<li><strong>3 aspherical elements</strong> minimize distortion and aberrations</li>
<li><strong>1 UD (Ultra-low Dispersion) element</strong> reduces chromatic aberrations</li>
<li><strong>ASC (Air Sphere Coating)</strong> virtually eliminates ghosting and flare</li>
<li><strong>Fluorine coating</strong> on front and rear elements repels dust and moisture</li>
<li><strong>9 groups, 15 elements</strong> optimized for the RF mount</li>
</ul>

<h3>Professional Features</h3>
<ul>
<li><strong>Dual Pixel CMOS AF</strong> with smooth, silent focusing</li>
<li><strong>Ring-type Ultrasonic Motor (USM)</strong> for lightning-fast AF</li>
<li><strong>Full-time manual focus override</strong> for precise adjustments</li>
<li><strong>Minimum focusing distance</strong>: 0.4m (1.3 ft)</li>
<li><strong>Maximum magnification</strong>: 0.19x for detailed close-ups</li>
</ul>

<h2>💡 Why Choose the RF 50mm f/1.2L?</h2>

<p>This lens represents the <strong>pinnacle of Canon's L-series engineering</strong>, designed specifically for the revolutionary RF mount. Its <strong>massive f/1.2 aperture</strong> opens creative possibilities impossible with smaller apertures.</p>

<h3>Key Advantages:</h3>
<ul>
<li>✅ <strong>Unmatched bokeh quality</strong> with 12-blade aperture design</li>
<li>✅ <strong>Professional build quality</strong> with weather sealing</li>
<li>✅ <strong>Lightning-fast autofocus</strong> optimized for EOS R cameras</li>
<li>✅ <strong>Exceptional sharpness</strong> even wide open at f/1.2</li>
<li>✅ <strong>RF mount advantages</strong> including enhanced communication and control</li>
</ul>

<h2>📦 What's Included</h2>
<ul>
<li>Canon RF 50mm f/1.2L USM Lens</li>
<li>Front Lens Cap E-77II</li>
<li>Rear Lens Cap RF</li>
<li>Lens Hood ET-87</li>
<li>Lens Case LP1424</li>
</ul>

<h2>🔧 Technical Specifications</h2>
<ul>
<li><strong>Mount</strong>: Canon RF</li>
<li><strong>Focal Length</strong>: 50mm</li>
<li><strong>Maximum Aperture</strong>: f/1.2</li>
<li><strong>Minimum Aperture</strong>: f/16</li>
<li><strong>Filter Thread</strong>: 77mm</li>
<li><strong>Weight</strong>: 950g (33.5 oz)</li>
<li><strong>Dimensions</strong>: 103 x 108.2mm</li>
</ul>

<h2>🎖️ Professional Recognition</h2>
<ul>
<li><strong>TIPA Award</strong> - Best Professional Lens 2019</li>
<li><strong>DPReview Gold Award</strong> - Outstanding optical performance</li>
<li><strong>Photography Blog Highly Recommended</strong> - Premium portrait lens</li>
</ul>

<hr>

<p><em>Experience the <strong>magic of f/1.2</strong> with Canon's most advanced 50mm lens - where technical excellence meets artistic vision for truly extraordinary portraits.</em></p>`,
      handle: "canon-rf-50mm-f1-2l-usm",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["canon-rf-50mm-f1-2l-usm"].thumbnail,
      images: productImages["canon-rf-50mm-f1-2l-usm"].images.map((url) => ({
        url,
      })),
      options: [
        {
          title: "Condition",
          values: ["New", "Open Box"],
        },
      ],
      variants: [
        {
          title: "New",
          sku: "CANON-RF-50-F12L-NEW",
          options: {
            Condition: "New",
          },
          prices: [
            {
              amount: 5800000000, // 58,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Open Box",
          sku: "CANON-RF-50-F12L-OPENBOX",
          options: {
            Condition: "Open Box",
          },
          prices: [
            {
              amount: 5200000000, // 52,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "GoPro Hero 12 Black",
      type_id: productTypeResult.find((type) => type.value === "camera")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Action Cameras")!.id,
      ],
      description: `<h1>GoPro HERO12 Black - The Ultimate Action Camera</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Extreme sports athletes</strong> capturing high-intensity action</li>
<li><strong>Content creators</strong> producing professional-quality videos</li>
<li><strong>Travel enthusiasts</strong> documenting adventures in any environment</li>
<li><strong>Underwater photographers</strong> exploring depths up to 10 meters</li>
<li><strong>Vloggers</strong> needing compact, versatile filming solutions</li>
</ul>

<h2>📹 Revolutionary Video Capabilities</h2>

<h3>Next-Generation Recording</h3>
<ul>
<li><strong>5.3K60 & 4K120</strong> ultra-high resolution video capture</li>
<li><strong>HDR video recording</strong> with stunning dynamic range</li>
<li><strong>10-bit color depth</strong> for professional post-production flexibility</li>
<li><strong>GP-Log encoding</strong> for maximum color grading control</li>
<li><strong>Timecode sync</strong> for multi-camera productions</li>
</ul>

<h3>Advanced Stabilization</h3>
<ul>
<li><strong>HyperSmooth 6.0</strong> with horizon lock technology</li>
<li><strong>360° horizon leveling</strong> keeps footage perfectly straight</li>
<li><strong>In-camera horizon leveling</strong> up to 45° tilt correction</li>
<li><strong>AutoBoost</strong> automatically selects optimal stabilization</li>
<li><strong>Locked, On, or Off</strong> stabilization modes for any situation</li>
</ul>

<h3>Creative Features</h3>
<ul>
<li><strong>TimeWarp 3.0</strong> with automatic speed ramping</li>
<li><strong>Star Trails</strong> for stunning astrophotography time-lapses</li>
<li><strong>Light Painting</strong> mode for creative long exposures</li>
<li><strong>Vehicle Lights</strong> specialized mode for traffic trails</li>
<li><strong>Burst Photo</strong> up to 25 photos in 1 second</li>
</ul>

<h2>🌊 Extreme Durability</h2>

<h3>Built for Adventure</h3>
<ul>
<li><strong>Waterproof to 10m</strong> without additional housing</li>
<li><strong>Rugged construction</strong> survives drops, impacts, and extreme conditions</li>
<li><strong>Operating temperature</strong>: -10°C to 35°C (14°F to 95°F)</li>
<li><strong>Corrosion-resistant</strong> for saltwater environments</li>
<li><strong>Scratch-resistant</strong> front and rear screens</li>
</ul>

<h3>Smart Connectivity</h3>
<ul>
<li><strong>Wi-Fi 6</strong> for faster file transfers and streaming</li>
<li><strong>Bluetooth 5.0</strong> for seamless device pairing</li>
<li><strong>GoPro Quik app</strong> integration for easy editing</li>
<li><strong>Live streaming</strong> to social platforms in 1080p</li>
<li><strong>Voice control</strong> in 10+ languages</li>
</ul>

<h2>💡 Why Choose HERO12 Black?</h2>

<p>The HERO12 Black represents <strong>15 years of action camera innovation</strong> compressed into the most advanced, versatile, and user-friendly design ever created.</p>

<h3>Game-Changing Features:</h3>
<ul>
<li>✅ <strong>Longest battery life</strong> in HERO series history</li>
<li>✅ <strong>Faster wireless connectivity</strong> with Wi-Fi 6</li>
<li>✅ <strong>Enhanced low-light performance</strong> for dawn and dusk adventures</li>
<li>✅ <strong>Improved wind-noise reduction</strong> for clearer audio</li>
<li>✅ <strong>Modular accessory system</strong> with hundreds of mounting options</li>
</ul>

<h2>📦 What's Included (Camera Only)</h2>
<ul>
<li>GoPro HERO12 Black Camera</li>
<li>Enduro Battery (1720mAh)</li>
<li>Curved Adhesive Mount</li>
<li>Mounting Buckle + Thumb Screw</li>
<li>USB-C Cable</li>
</ul>

<h2>📦 Creator Edition Includes</h2>
<ul>
<li>Everything from Camera Only package</li>
<li>Volta Power Grip (battery + remote + tripod)</li>
<li>Media Mod (directional mic + HDMI out)</li>
<li>Light Mod (adjustable LED light)</li>
<li>Magnetic Swivel Clip</li>
<li>Additional Enduro Battery</li>
</ul>

<h2>🎖️ Industry Awards</h2>
<ul>
<li><strong>EISA Award</strong> - Action Camera 2023-2024</li>
<li><strong>Red Dot Design Award</strong> - Product Design 2023</li>
<li><strong>CES Innovation Award</strong> - Digital Imaging 2023</li>
</ul>

<hr>

<p><em>Push the boundaries of what's possible with the <strong>GoPro HERO12 Black</strong> - where <strong>professional-grade performance</strong> meets <strong>unbreakable durability</strong> for adventures that never end.</em></p>`,
      handle: "gopro-hero-12-black",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["gopro-hero-12-black"].thumbnail,
      images: productImages["gopro-hero-12-black"].images.map((url) => ({
        url,
      })),
      options: [
        {
          title: "Package",
          values: ["Camera only", "Creator Edition"],
        },
      ],
      variants: [
        {
          title: "Camera only",
          sku: "GOPRO-HERO12-CAMERA",
          options: {
            Package: "Camera only",
          },
          prices: [
            {
              amount: 1050000000, // 10,500,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Creator Edition",
          sku: "GOPRO-HERO12-CREATOR",
          options: {
            Package: "Creator Edition",
          },
          prices: [
            {
              amount: 1450000000, // 14,500,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "Leica M11",
      type_id: productTypeResult.find((type) => type.value === "camera")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Film Cameras")!.id,
      ],
      description: `<h1>Leica M11 - The Pinnacle of Rangefinder Excellence</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Master photographers</strong> seeking the ultimate manual experience</li>
<li><strong>Street photography purists</strong> demanding discretion and precision</li>
<li><strong>Collectors</strong> investing in photographic heritage</li>
<li><strong>Fine art photographers</strong> requiring exceptional image quality</li>
<li><strong>Documentary shooters</strong> valuing authentic, unobtrusive capture</li>
</ul>

<h2>📸 Revolutionary Sensor Technology</h2>

<h3>Groundbreaking 60MP Resolution</h3>
<ul>
<li><strong>60 Megapixel BSI CMOS sensor</strong> with unprecedented detail</li>
<li><strong>Triple resolution mode</strong>: 60MP, 36MP, and 18MP native options</li>
<li><strong>ISO range</strong>: 64-50,000 for incredible versatility</li>
<li><strong>14-bit color depth</strong> capturing subtle tonal gradations</li>
<li><strong>No anti-aliasing filter</strong> for maximum sharpness</li>
</ul>

<h3>Classic Rangefinder Design</h3>
<ul>
<li><strong>Iconic Leica rangefinder mechanism</strong> refined over decades</li>
<li><strong>0.73x magnification</strong> bright-line viewfinder</li>
<li><strong>Automatic parallax correction</strong> for precise framing</li>
<li><strong>Manual focus confirmation</strong> with rangefinder patch</li>
<li><strong>Silent leaf shutter mode</strong> for discrete shooting</li>
</ul>

<h3>Advanced Digital Features</h3>
<ul>
<li><strong>3" touchscreen LCD</strong> with 2.3 million dots</li>
<li><strong>Electronic viewfinder option</strong> via Visoflex EVF (optional)</li>
<li><strong>Content Credentials</strong> for image authenticity verification</li>
<li><strong>Wi-Fi connectivity</strong> for seamless file transfer</li>
<li><strong>USB-C charging</strong> while shooting</li>
</ul>

<h2>💪 Built for Generations</h2>

<h3>Legendary Construction</h3>
<ul>
<li><strong>Full magnesium body</strong> with brass top plate</li>
<li><strong>Weather-sealed</strong> construction for all conditions</li>
<li><strong>Precision-milled</strong> from solid aluminum blocks</li>
<li><strong>Sapphire crystal</strong> LCD cover glass</li>
<li><strong>Hand-assembled</strong> in Wetzlar, Germany</li>
</ul>

<h3>Timeless Compatibility</h3>
<ul>
<li><strong>Compatible with all M-lenses</strong> since 1954</li>
<li><strong>6-bit lens coding</strong> for automatic recognition</li>
<li><strong>Leica M lens simulator</strong> shows field of view</li>
<li><strong>Focus peaking</strong> and magnification aids</li>
<li><strong>Legacy lens support</strong> with manual settings</li>
</ul>

<h2>💡 Why Choose the Leica M11?</h2>

<p>The M11 represents <strong>170 years of optical excellence</strong> distilled into the most advanced rangefinder ever created. It's not just a camera - it's an <strong>instrument of artistic expression</strong>.</p>

<h3>Unique Advantages:</h3>
<ul>
<li>✅ <strong>Unmatched build quality</strong> lasting generations</li>
<li>✅ <strong>Discrete operation</strong> for candid photography</li>
<li>✅ <strong>Manual focus mastery</strong> developing true photographic skills</li>
<li>✅ <strong>Investment value</strong> holding worth over time</li>
<li>✅ <strong>Legendary Leica color science</strong> with distinctive rendering</li>
</ul>

<h2>📦 What's Included</h2>
<ul>
<li>Leica M11 Camera Body</li>
<li>BP-SCL6 Lithium-Ion Battery</li>
<li>BC-SCL6 Battery Charger</li>
<li>USB-C Cable</li>
<li>Hand Strap</li>
<li>Body Cap</li>
<li>Leica Warranty Certificate</li>
</ul>

<h2>🔧 Technical Specifications</h2>
<ul>
<li><strong>Sensor</strong>: 60MP Full-Frame BSI CMOS</li>
<li><strong>Mount</strong>: Leica M bayonet</li>
<li><strong>Shutter</strong>: Mechanical + Electronic leaf</li>
<li><strong>Speed Range</strong>: 60 seconds to 1/4000s</li>
<li><strong>Storage</strong>: CFexpress Type B + SD UHS-II</li>
<li><strong>Weight</strong>: 530g (body only)</li>
<li><strong>Dimensions</strong>: 139 x 80 x 38.5mm</li>
</ul>

<h2>🎖️ Heritage & Awards</h2>
<ul>
<li><strong>Red Dot Design Award</strong> - Product Design Excellence</li>
<li><strong>TIPA Award</strong> - Best Expert Camera 2022</li>
<li><strong>170 years</strong> of German optical craftsmanship</li>
<li><strong>Legendary status</strong> among world's greatest photographers</li>
</ul>

<hr>

<p><em>Join the <strong>legacy of Leica excellence</strong> with the M11 - where <strong>tradition meets innovation</strong> in the world's most coveted rangefinder camera.</em></p>`,
      handle: "leica-m11",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["leica-m11"].thumbnail,
      images: productImages["leica-m11"].images.map((url) => ({ url })),
      options: [
        {
          title: "Color",
          values: ["Silver Chrome", "Black Paint"],
        },
      ],
      variants: [
        {
          title: "Silver Chrome",
          sku: "LEICA-M11-SILVER",
          options: {
            Color: "Silver Chrome",
          },
          prices: [
            {
              amount: 20500000000, // 205,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Black Paint",
          sku: "LEICA-M11-BLACK",
          options: {
            Color: "Black Paint",
          },
          prices: [
            {
              amount: 21000000000, // 210,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "Fujifilm Instax Mini 12",
      type_id: productTypeResult.find((type) => type.value === "camera")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Instant Cameras")!.id,
      ],
      description: `<h1>Fujifilm Instax Mini 12 - Instant Joy in Every Shot</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Social gatherings</strong> creating instant memories to share</li>
<li><strong>Young photographers</strong> starting their instant photography journey</li>
<li><strong>Gift giving</strong> bringing smiles to friends and family</li>
<li><strong>Parties & events</strong> providing immediate photo keepsakes</li>
<li><strong>Creative expression</strong> with fun, spontaneous photography</li>
</ul>

<h2>📸 Simple Yet Smart Features</h2>

<h3>Automatic Excellence</h3>
<ul>
<li><strong>Automatic Exposure</strong> adjusts perfectly to any lighting</li>
<li><strong>Smart flash</strong> fires only when needed</li>
<li><strong>One-touch operation</strong> for effortless instant photos</li>
<li><strong>Built-in close-up lens</strong> flips down for selfies and close shots</li>
<li><strong>Twisted lanyard</strong> attachment for secure carrying</li>
</ul>

<h3>Instant Gratification</h3>
<ul>
<li><strong>Credit card-sized prints</strong> perfect for wallets and scrapbooks</li>
<li><strong>Development time</strong>: Photos appear in 90 seconds</li>
<li><strong>Bright, vibrant colors</strong> with classic Fujifilm quality</li>
<li><strong>Peel-apart design</strong> reveals finished photo instantly</li>
<li><strong>Compatible with Instax Mini film</strong> widely available worldwide</li>
</ul>

<h3>Fun Color Options</h3>
<ul>
<li><strong>Pastel Blue</strong> - Soft and dreamy sky-inspired tone</li>
<li><strong>Lilac Purple</strong> - Elegant lavender for sophisticated style</li>
<li><strong>Mint Green</strong> - Fresh, vibrant color for nature lovers</li>
<li><strong>Blossom Pink</strong> - Sweet cherry blossom aesthetic</li>
<li><strong>Clay White</strong> - Clean, timeless neutral option</li>
</ul>

<h2>💡 Why Choose Instax Mini 12?</h2>

<p>In our digital world, the <strong>Instax Mini 12</strong> brings back the <strong>magic of physical photographs</strong>. Every shot is precious, making each moment more meaningful and deliberate.</p>

<h3>Unique Benefits:</h3>
<ul>
<li>✅ <strong>No charging required</strong> - uses AA batteries for extended use</li>
<li>✅ <strong>Instant sharing</strong> - no waiting for prints or digital transfers</li>
<li>✅ <strong>Screen-free experience</strong> encouraging genuine social connection</li>
<li>✅ <strong>Physical keepsakes</strong> that last forever without digital storage</li>
<li>✅ <strong>Creative constraints</strong> that enhance photographic creativity</li>
</ul>

<h2>📦 What's Included</h2>
<ul>
<li>Fujifilm Instax Mini 12 Camera</li>
<li>Hand Strap</li>
<li>Instruction Manual</li>
<li>Warranty Information</li>
<li><strong>Note</strong>: AA batteries and film sold separately</li>
</ul>

<h2>🎨 Creative Possibilities</h2>

<h3>Photo Projects</h3>
<ul>
<li><strong>Scrapbooking</strong> with instant, tangible memories</li>
<li><strong>Photo walls</strong> decorating spaces with personal moments</li>
<li><strong>Gift cards</strong> writing personal messages on white borders</li>
<li><strong>Photo trading</strong> sharing physical memories with friends</li>
<li><strong>Event documentation</strong> weddings, parties, and celebrations</li>
</ul>

<h3>Technical Simplicity</h3>
<ul>
<li><strong>No complex settings</strong> to learn or master</li>
<li><strong>Foolproof operation</strong> perfect for all ages</li>
<li><strong>Compact design</strong> fits easily in purses and backpacks</li>
<li><strong>Durable construction</strong> built for everyday adventures</li>
<li><strong>Low maintenance</strong> simple cleaning and care</li>
</ul>

<h2>🎖️ Fun & Recognition</h2>
<ul>
<li><strong>Best Instant Camera</strong> - Multiple photography blogs 2023</li>
<li><strong>Family Choice Award</strong> - Easy-to-use design</li>
<li><strong>Over 1 million units sold</strong> worldwide since launch</li>
<li><strong>Social media favorite</strong> with thousands of #InstaxMini12 posts</li>
</ul>

<hr>

<p><em>Rediscover the <strong>joy of instant photography</strong> with the Fujifilm Instax Mini 12 - where every click creates a <strong>tangible memory</strong> to treasure forever.</em></p>`,
      handle: "fujifilm-instax-mini-12",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["fujifilm-instax-mini-12"].thumbnail,
      images: productImages["fujifilm-instax-mini-12"].images.map((url) => ({
        url,
      })),
      options: [
        {
          title: "Color",
          values: [
            "Pastel Blue",
            "Lilac Purple",
            "Mint Green",
            "Blossom Pink",
            "Clay White",
          ],
        },
      ],
      variants: [
        {
          title: "Pastel Blue",
          sku: "FUJI-INSTAX-MINI12-BLUE",
          options: {
            Color: "Pastel Blue",
          },
          prices: [
            {
              amount: 190000000, // 1,900,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Lilac Purple",
          sku: "FUJI-INSTAX-MINI12-PURPLE",
          options: {
            Color: "Lilac Purple",
          },
          prices: [
            {
              amount: 190000000, // 1,900,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Mint Green",
          sku: "FUJI-INSTAX-MINI12-GREEN",
          options: {
            Color: "Mint Green",
          },
          prices: [
            {
              amount: 190000000, // 1,900,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Blossom Pink",
          sku: "FUJI-INSTAX-MINI12-PINK",
          options: {
            Color: "Blossom Pink",
          },
          prices: [
            {
              amount: 190000000, // 1,900,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Clay White",
          sku: "FUJI-INSTAX-MINI12-WHITE",
          options: {
            Color: "Clay White",
          },
          prices: [
            {
              amount: 190000000, // 1,900,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
    {
      title: "Sony FE 24-70mm f/2.8 GM II",
      type_id: productTypeResult.find((type) => type.value === "lens")?.id!,
      category_ids: [
        categoryResult.find((cat) => cat.name === "Zoom Lenses")!.id,
      ],
      description: `<h1>Sony FE 24-70mm f/2.8 GM II - The Ultimate Standard Zoom</h1>

<h2>🎯 Perfect For</h2>
<ul>
<li><strong>Professional photographers</strong> demanding versatile focal range excellence</li>
<li><strong>Wedding shooters</strong> needing reliable performance in varied conditions</li>
<li><strong>Commercial photographers</strong> requiring exceptional sharpness and bokeh</li>
<li><strong>Content creators</strong> seeking cinema-quality video performance</li>
<li><strong>Travel photographers</strong> wanting one lens for every situation</li>
</ul>

<h2>📸 Revolutionary G Master Optics</h2>

<h3>Next-Generation Optical Design</h3>
<ul>
<li><strong>21 elements in 15 groups</strong> optimized for exceptional performance</li>
<li><strong>2 XA (Extreme Aspherical) elements</strong> minimize distortion and aberrations</li>
<li><strong>3 ED (Extra-low Dispersion) elements</strong> control chromatic aberrations</li>
<li><strong>Super ED element</strong> provides superior color correction</li>
<li><strong>Nano AR Coating II</strong> virtually eliminates ghosting and flare</li>
</ul>

<h3>Professional Performance</h3>
<ul>
<li><strong>Constant f/2.8 aperture</strong> throughout the zoom range</li>
<li><strong>11-blade circular aperture</strong> creates beautiful, smooth bokeh</li>
<li><strong>Close focusing</strong>: 0.21m at 24mm, 0.30m at 70mm</li>
<li><strong>Maximum magnification</strong>: 0.32x for detailed close-up work</li>
<li><strong>Weather-sealed construction</strong> for demanding conditions</li>
</ul>

<h3>Advanced Autofocus System</h3>
<ul>
<li><strong>4 XD Linear Motors</strong> provide lightning-fast, silent focusing</li>
<li><strong>Internal focus design</strong> maintains balance during zooming</li>
<li><strong>Focus breathing suppression</strong> ideal for video applications</li>
<li><strong>Customizable focus hold buttons</strong> for immediate manual override</li>
<li><strong>Linear Response MF</strong> for precise manual focus control</li>
</ul>

<h2>💪 Engineering Excellence</h2>

<h3>Weight Reduction Innovation</h3>
<ul>
<li><strong>20% lighter</strong> than original GM version (695g vs 886g)</li>
<li><strong>Advanced materials</strong> maintain durability while reducing weight</li>
<li><strong>Improved balance</strong> on all Sony camera bodies</li>
<li><strong>Comfortable handling</strong> during extended shooting sessions</li>
<li><strong>Travel-friendly size</strong> without compromising performance</li>
</ul>

<h3>Video Optimization</h3>
<ul>
<li><strong>Focus breathing compensation</strong> for smooth focal transitions</li>
<li><strong>Silent operation</strong> perfect for video recording</li>
<li><strong>Minimal focus shift</strong> during zooming</li>
<li><strong>Clickless aperture ring</strong> for smooth exposure changes</li>
<li><strong>Professional cine features</strong> in a photography lens</li>
</ul>

<h2>💡 Why Choose the GM II?</h2>

<p>The FE 24-70mm f/2.8 GM II represents <strong>Sony's commitment to perfection</strong>, combining <strong>cutting-edge technology</strong> with <strong>practical usability</strong> for professionals who accept no compromises.</p>

<h3>Standout Features:</h3>
<ul>
<li>✅ <strong>G Master resolution</strong> across the entire frame</li>
<li>✅ <strong>Dramatically reduced weight</strong> for improved handling</li>
<li>✅ <strong>Enhanced video capabilities</strong> for hybrid shooters</li>
<li>✅ <strong>Exceptional build quality</strong> built to last decades</li>
<li>✅ <strong>Wide compatibility</strong> with all Sony FE cameras</li>
</ul>

<h2>📦 What's Included</h2>
<ul>
<li>Sony FE 24-70mm f/2.8 GM II Lens</li>
<li>Front Lens Cap (82mm)</li>
<li>Rear Lens Cap</li>
<li>Lens Hood (ALC-SH176)</li>
<li>Carrying Case</li>
</ul>

<h2>🔧 Technical Specifications</h2>
<ul>
<li><strong>Mount</strong>: Sony FE (Full-frame E-mount)</li>
<li><strong>Focal Length</strong>: 24-70mm</li>
<li><strong>Maximum Aperture</strong>: f/2.8 (constant)</li>
<li><strong>Minimum Aperture</strong>: f/22</li>
<li><strong>Filter Thread</strong>: 82mm</li>
<li><strong>Weight</strong>: 695g (1.53 lbs)</li>
<li><strong>Dimensions</strong>: 87.8 x 119.5mm</li>
</ul>

<h2>🎖️ Professional Recognition</h2>
<ul>
<li><strong>TIPA Award</strong> - Best Photo Lens 2022</li>
<li><strong>DPReview Gold Award</strong> - Outstanding Performance</li>
<li><strong>Photography Blog Highly Recommended</strong> - Professional Standard</li>
<li><strong>EISA Award</strong> - Professional Lens 2022-2023</li>
</ul>

<hr>

<p><em>Experience the <strong>evolution of professional photography</strong> with Sony's FE 24-70mm f/2.8 GM II - where <strong>uncompromising quality</strong> meets <strong>innovative engineering</strong> for the modern professional.</em></p>`,
      handle: "sony-fe-24-70mm-f2-8-gm-ii",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: productImages["sony-fe-24-70mm-f2-8-gm-ii"].thumbnail,
      images: productImages["sony-fe-24-70mm-f2-8-gm-ii"].images.map((url) => ({
        url,
      })),
      options: [
        {
          title: "Condition",
          values: ["New", "Demo Unit"],
        },
      ],
      variants: [
        {
          title: "New",
          sku: "SONY-FE-24-70-GM2-NEW",
          options: {
            Condition: "New",
          },
          prices: [
            {
              amount: 6800000000, // 68,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
        {
          title: "Demo Unit",
          sku: "SONY-FE-24-70-GM2-DEMO",
          options: {
            Condition: "Demo Unit",
          },
          prices: [
            {
              amount: 6200000000, // 62,000,000 VND
              currency_code: "vnd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    },
  ];
};
