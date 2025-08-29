import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import multer from "multer"
import path from "path"
import fs from "fs"
import { promisify } from "util"

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "static", "uploads", "images")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for memory storage (we'll handle file saving)
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (_req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

const uploadSingle = promisify(upload.single("image"))

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    await uploadSingle(req as any, res as any)

    if (!req.file) {
      res.status(400).json({
        error: "No file uploaded",
      })
      return
    }

    // Use direct file system storage for consistency
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(req.file.originalname)
    const name = path.basename(req.file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase()
    const filename = `${name}-${uniqueSuffix}${ext}`
    const filePath = path.join(uploadDir, filename)

    // Write file to disk
    await fs.promises.writeFile(filePath, req.file.buffer)

    const fileUrl = `/static/uploads/images/${filename}`

    res.json({
      success: true,
      url: fileUrl,
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file"
    res.status(500).json({
      error: errorMessage,
    })
  }
}