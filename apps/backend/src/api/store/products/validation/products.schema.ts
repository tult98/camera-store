import { z } from "zod";

export const ProductByHandleSchema = z.object({
  handle: z.string().min(1, "Handle is required").max(255).regex(
    /^[a-zA-Z0-9_-]+$/,
    "Handle can only contain letters, numbers, hyphens, and underscores"
  ),
});

export class ProductValidator {
  static validateHandle(handle: unknown): string {
    if (
      !handle ||
      typeof handle !== "string" ||
      handle.trim() === ""
    ) {
      throw new Error("Valid product handle is required");
    }
    
    const sanitized = handle.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    
    if (sanitized.length === 0 || sanitized.length > 255) {
      throw new Error("Invalid product handle format");
    }
    
    return sanitized;
  }

  static validateHeaders(headers: Record<string, unknown>): {
    region_id: string;
    currency_code: string;
  } {
    const region_id = headers["region_id"] as string;
    const currency_code = headers["currency_code"] as string;

    if (!region_id || !currency_code) {
      throw new Error("region_id and currency_code headers are required");
    }

    return { region_id, currency_code };
  }
}