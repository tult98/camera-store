import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env['NODE_ENV'] || 'development', process.cwd())

const databaseUrl = process.env['DATABASE_URL']
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl,
    http: {
      storeCors: process.env['STORE_CORS'] || "http://localhost:8000",
      adminCors: process.env['ADMIN_CORS'] || "http://localhost:7001",
      authCors: process.env['AUTH_CORS'] || "http://localhost:8000",
      jwtSecret: process.env['JWT_SECRET'] || "supersecret",
      cookieSecret: process.env['COOKIE_SECRET'] || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/product-attributes",
      key: "productAttributes"
    },
    // {
    //   resolve: "@medusajs/file",
    //   options: {
    //     providers: [
    //       {
    //         resolve: "@medusajs/file-local",
    //         id: "local",
    //         options: {
    //           upload_dir: "static/uploads",
    //           backend_url: process.env['MEDUSA_BACKEND_URL'] || "http://localhost:9000"
    //         }
    //       }
    //     ]
    //   }
    // }
  ]
})
