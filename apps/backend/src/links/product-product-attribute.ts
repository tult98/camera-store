import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductAttributeModule from "../modules/product-attributes";

export default defineLink(
  ProductModule.linkable.product,
  ProductAttributeModule.linkable.productAttribute
);
