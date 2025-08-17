import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({ message: "Backend deployment test", timestamp: new Date().toISOString() });
}
