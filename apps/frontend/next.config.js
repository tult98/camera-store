const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    trustHost: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "fujifilm-x.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "product.hstatic.net",
      },
      {
        protocol: "https",
        hostname: "fujifilmshop.vn",
      },
      {
        protocol: "https",
        hostname: "shopusa.fujifilm-x.com",
      },
      {
        protocol: "https",
        hostname: "cdn.vjshop.vn",
      },
      {
        protocol: "https",
        hostname: "images2.jessops.com",
      },
      {
        protocol: "https",
        hostname: "img.photographyblog.com",
      },
      {
        protocol: "https",
        hostname: "tokyocamera.vn",
      },
      {
        protocol: "https",
        hostname: "thecamerastore.com",
      },
      {
        protocol: "https",
        hostname: "giangduydat.vn",
      },
      {
        protocol: "https",
        hostname: "leicavietnam.com",
      },
      {
        protocol: "https",
        hostname: "asset.fujifilm.com",
      },
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "ph-camera.sgp1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "ph-camera.sgp1.cdn.digitaloceanspaces.com",
      }
    ],
  },
}

module.exports = nextConfig
