import type { File } from "multer"

declare module "@medusajs/framework" {
  interface MedusaRequest {
    file?: File
    files?: File[]
  }
}