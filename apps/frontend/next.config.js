const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["staging.phcamera.com", "www.phcamera.com"],
    },
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
        protocol: "https",
        hostname: "ph-camera.sgp1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "ph-camera.sgp1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "bucket-fdsj-staging.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "bucket-fdsj-production.up.railway.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
}

module.exports = nextConfig
