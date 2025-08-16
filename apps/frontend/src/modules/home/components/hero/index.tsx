import { CameraIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="flex justify-center mb-6">
            <CameraIcon className="w-20 h-20 text-primary" />
          </div>
          <Heading
            level="h1"
            className="text-5xl font-bold text-base-content mb-4"
          >
            Professional Camera Store
          </Heading>
          <Heading
            level="h2"
            className="text-xl text-base-content/70 mb-8"
          >
            Capture life's moments with our premium camera collection. From DSLRs to mirrorless cameras, find your perfect shot.
          </Heading>
          <div className="flex gap-4 justify-center">
            <Button className="btn btn-primary">
              <ShoppingBagIcon className="w-5 h-5" />
              Shop Now
            </Button>
            <Button variant="secondary" className="btn btn-outline">
              Browse Cameras
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
