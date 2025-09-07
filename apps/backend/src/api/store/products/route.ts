import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { ProductsService } from "./services/products.service";
import { ProductValidator } from "./validation/products.schema";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    
    const { handle } = req.query;

    const sanitizedHandle = ProductValidator.validateHandle(handle);
    const { region_id, currency_code } = ProductValidator.validateHeaders(req.headers);

    const productsService = new ProductsService(req.scope);
    
    const product = await productsService.getProductByHandle({
      handle: sanitizedHandle,
      region_id,
      currency_code,
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    logger.debug(`Retrieved product by handle: ${sanitizedHandle}`);

    return res.json({ product });
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    logger.error(`Error retrieving product: ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error && error.message.includes("required")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};