"use client"

interface MediaContent {
  type: 'image' | 'video'
  url: string
  position: 'left' | 'right' | 'inline'
}

interface DescriptionFeature {
  header: string
  headerLevel: number
  content: string
  media: MediaContent | null
  subFeatures: DescriptionFeature[]
}

const MOCK_DATA: DescriptionFeature[] = [
  {
    header: "Timeless Design, Cutting-Edge Tech, Unforgettable Imagery",
    headerLevel: 2,
    content: "Having refined the retro styling and ergonomics of the rangefinder-inspired X100-series in its viral fifth iteration, <b>FUJIFILM</b> follows up with the tricked-out silver <b>X100VI Mirrorless Camera</b>, filling out the timeless, compact, touch-friendly body with the speed, power, and pixel count of its flagship APS-C sensor-and-processor combo. Featuring unsurpassed design and a wealth of upgraded tech, the X100VI is poised to be the everyday, everywhere darling of photographers who yearn to transform the mundane into the magical.",
    media: {
      type: "video",
      url: "https://www.youtube.com/embed/-P7CQKJ-3Wo?autoplay=0&start=0&enablejsapi=1",
      position: "inline"
    },
    subFeatures: []
  },
  {
    header: "40MP X-Trans CMOS 5 HR Sensor, X-Processor 5",
    headerLevel: 2,
    content: "The high-resolution 40.2MP X-Trans CMOS 5 HR sensor has an enhanced image-processing algorithm that boosts resolution without compromising the signal-to-noise ratio, delivering astonishing image quality. This sensor has an improved pixel structure, allowing light to be received more efficiently. Partner to the newly designed sensor is a fresh engine-the X-Processor 5-which uses 64-bit processing to realize 3x faster speeds for both video and photo tasks. The combination of this high-resolution sensor and processor achieves remarkably fast operation, wide dynamic range, and incredible photo quality, even at higher ISO sensitivities.\n\nThe powerful video function afforded with the sensor-processor combo means movies can be recorded internally at up to 6.2K at 30p in 10-bit color, along with a 4K HQ mode which oversamples 6.2K footage for superior 4K output. Higher frame rate videos, at 4K 60p or FHD 240p, are also available.\n\nThe upgraded sensor-processor combination allows the X100VI to be the first in the series to feature in-body image stabilization. The five-axis sensor-shift IBIS helps to minimize the appearance of camera shake by up to six stops. The improved processing also benefits autofocus performance, producing a faster, more intelligent hybrid focusing system using 425 phase-detection points. Backed by deep learning, an AI adaptive algorithm means this focusing system is better suited to automatically detect and track a variety of subject types, ensuring the magic moment is never missed.\n\nFurther benefiting street photographers, the X100VI is ready for action, no matter how fast the subject is moving. A top electronic shutter speed of 1/180,000 sec and a maximum mechanical shutter speed of 1/4000 sec will stop any subject in its tracks. Keep your finger down, and the X100VI records images at up to 20 fps with the electronic shutter at a 1.29x crop, and 11 fps with the mechanical shutter.",
    media: null,
    subFeatures: [
      {
        header: "Powerful Video Capabilities",
        headerLevel: 3,
        content: "The powerful video function afforded with the sensor-processor combo means movies can be recorded internally at up to 6.2K at 30p in 10-bit color, along with a 4K HQ mode which oversamples 6.2K footage for superior 4K output. Higher frame rate videos, at 4K 60p or FHD 240p, are also available.",
        media: null,
        subFeatures: []
      },
      {
        header: "In-Body Image Stabilization, Improved Autofocus",
        headerLevel: 3,
        content: "The upgraded sensor-processor combination allows the X100VI to be the first in the series to feature in-body image stabilization. The five-axis sensor-shift IBIS helps to minimize the appearance of camera shake by up to six stops. The improved processing also benefits autofocus performance, producing a faster, more intelligent hybrid focusing system using 425 phase-detection points. Backed by deep learning, an AI adaptive algorithm means this focusing system is better suited to automatically detect and track a variety of subject types, ensuring the magic moment is never missed.",
        media: null,
        subFeatures: []
      },
      {
        header: "Built for Speed, Built for the Street",
        headerLevel: 3,
        content: "Further benefiting street photographers, the X100VI is ready for action, no matter how fast the subject is moving. A top electronic shutter speed of 1/180,000 sec and a maximum mechanical shutter speed of 1/4000 sec will stop any subject in its tracks. Keep your finger down, and the X100VI records images at up to 20 fps with the electronic shutter at a 1.29x crop, and 11 fps with the mechanical shutter.",
        media: null,
        subFeatures: []
      }
    ]
  },
  {
    header: "Fujinon 23mm f/2 Lens",
    headerLevel: 2,
    content: "Updated in the fifth generation, the camera's Fujinon 23mm f/2 lens features a revised optical design that includes two aspherical elements for improved sharpness and clarity through the reduction of spherical aberrations and distortion. With a 35mm full-frame equivalency, the lens' bright f/2 design handles low-light conditions and affords shallow depth of field. When it's bright, the built-in 4-stop ND filter can also be used for more control over your exposures and to better enable working with shallow depth of field. While the lens is a fixed focal length, the X100VI integrates 1.4x and 2x digital teleconverter settings to simulate the look of working with the longer focal lengths of 49mm and 70mm, respectively.",
    media: {
      type: "image",
      url: "https://bucket-fdsj-staging.up.railway.app/ph-camera/6ef660a4-IMG_2190309.jpg",
      position: "right"
    },
    subFeatures: []
  },
  {
    header: "Advanced Hybrid Viewfinder",
    headerLevel: 2,
    content: "Both optical and electronic viewfinder types are incorporated into the unique Advanced Hybrid Viewfinder, which lets you select from the simplicity and familiarity of an OVF as well as the versatility of an EVF. The optical viewfinder provides a clear, lifelike view of the scene for easier composition and subject tracking. Its enhanced design incorporates an Electronic Rangefinder function, which mimics the functionality of a mechanical rangefinder, and simultaneously overlays information from the electronic viewfinder on top of the optical viewfinder for comparative manual focus control.",
    media: {
      type: "image",
      url: "https://bucket-fdsj-staging.up.railway.app/ph-camera/c72156f0-IMG_2190307.jpg",
      position: "left"
    },
    subFeatures: []
  },
  {
    header: "Film Simulation Modes",
    headerLevel: 2,
    content: "Film Simulation modes allow you to reproduce the look and feel of several of FUJIFILM's film types. The X100VI boasts FUJIFILM's latest recipe-REALA ACE-and also includes 19 other modes, including Provia, Velvia, Astia, Classic Chrome, PRO Neg.Std, PRO Neg. Hi, Classic Neg., Nostalgic Neg., Eterna Cinema, Eterna Bleach Bypass, Acros, Acros + Ye Filter, Acros + R Filter, Acros + G Filter, Black &amp; White, Black &amp; White + Ye Filter, Black &amp; White + R Filter, Black &amp; White + G Filter, and Sepia.<p></p><p>In addition to simulating specific film types, a Grain Effect mode is also available to replicate the look of old film photos with an organic textured appearance, which is especially noticeable when printing. Color Chrome and Color Chrome Blue effects are also available to deepen color, tonal response, and gradation with higher saturation colors.</p>",
    media: null,
    subFeatures: []
  },
  {
    header: "Frame.io Camera-to-Cloud integration",
    headerLevel: 2,
    content: "Deliver photos or video straight to the cloud moments after they're created with the first accessory-free integration for Frame.io Camera to Cloud. Use the camera's built-in Wi-Fi or Ethernet LAN connection to connect to Frame.io and deliver hi-res raw or JPEG images, send h.264 video proxies, or upload video securely for review.",
    media: null,
    subFeatures: []
  },
  {
    header: "Body Design",
    headerLevel: 2,
    content: "<ul><li>With the same 5 x 3 x 2.1\" dimensions of its predecessor, it weighs just 1.5 oz more for a portable 1.1 lb total weight.</li><li>Tilting 3.0\" 1.62m-dot LCD has a touchscreen design for intuitive operation and playback.</li><li>Durable design can be made weather resistant when paired with the optional AR-X100 Adapter Ring and optional weather-sealing protection ring.</li><li>The top plate incorporates a series of locking dials and levers for fast, intuitive control over exposure settings, including dials for shutter speed and exposure compensation.</li><li>Front and rear command dials integrate a push function for easier use and settings selection.</li><li>Rear joystick is available for intuitive selecting and switching of AF points as well as menu navigation and image playback.</li><li>Integrated Bluetooth and Wi-Fi connectivity allows for wirelessly sharing images to a mobile device or to use the device to remotely control the camera.</li><li>Single SD memory card slot supports up to the UHS-I standard.</li><li>Included NP-W126S battery provides approximately 310 frames per charge when working with the EVF or 450 frames per charge when working with the OVF.</li></ul>",
    media: {
      type: "image",
      url: "https://bucket-fdsj-staging.up.railway.app/ph-camera/2af16395-IMG_2190308.jpg",
      position: "right"
    },
    subFeatures: []
  }
]

const ProductDescriptionMock = () => {
  const renderMedia = (media: MediaContent) => {
    if (media.type === 'image') {
      return (
        <figure className="product-description-media-wrapper">
          <img
            src={media.url}
            alt="Product feature"
            className="product-description-media"
          />
        </figure>
      )
    } else if (media.type === 'video') {
      return (
        <figure className="product-description-media-wrapper">
          <div className="product-description-video">
            <iframe
              src={media.url}
              title="Product video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </figure>
      )
    }
    return null
  }

  const renderFeature = (feature: DescriptionFeature, index: number): React.ReactNode => {
    const HeadingTag = `h${feature.headerLevel}` as keyof JSX.IntrinsicElements
    const headerClass = feature.headerLevel === 2
      ? "product-description-header"
      : "product-description-subheader"

    const contentClass = feature.media
      ? `product-description-content-${feature.media.position}`
      : "product-description-content-inline"

    return (
      <section key={index} className="product-description-section">
        {!feature.media && (
          <HeadingTag className={headerClass}>
            {feature.header}
          </HeadingTag>
        )}

        <div className={contentClass}>
          <div className="product-description-text">
            {feature.media && (
              <HeadingTag className={headerClass}>
                {feature.header}
              </HeadingTag>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: feature.content }}
            />
          </div>

          {feature.media && renderMedia(feature.media)}
        </div>

        {feature.subFeatures && feature.subFeatures.length > 0 && (
          <div className="product-description-subfeature">
            {feature.subFeatures.map((subFeature, subIndex) => renderFeature(subFeature, subIndex))}
          </div>
        )}
      </section>
    )
  }

  return (
    <article className="product-description">
      {MOCK_DATA.map((feature, index) => renderFeature(feature, index))}
    </article>
  )
}

export default ProductDescriptionMock
