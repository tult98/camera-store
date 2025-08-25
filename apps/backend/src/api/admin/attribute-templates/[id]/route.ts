import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../../modules/product-attributes";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productAttributesModuleService = req.scope.resolve(
    PRODUCT_ATTRIBUTES_MODULE
  );
  const { id } = req.params;

  const attributeTemplate =
    await productAttributesModuleService.retrieveAttributeTemplate(id);

  res.json({
    attribute_template: attributeTemplate,
  });
};

interface UpdateAttributeTemplateRequest {
  name: string;
  code: string;
  description?: string;
  attribute_definitions: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "select" | "boolean";
    options?: string[];
    option_group?: string;
    required: boolean;
    display_order: number;
    help_text?: string;
    validation?: {
      rules: string[];
      min?: number;
      max?: number;
      regex?: string;
    };
    default_value?: unknown;
    unit?: string;
    placeholder?: string;
  }>;
  is_active: boolean;
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const productAttributesModuleService = req.scope.resolve(
    PRODUCT_ATTRIBUTES_MODULE
  );
  const { id } = req.params;

  try {
    const body = req.body as UpdateAttributeTemplateRequest;

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        details: "Template name is required",
      });
      return;
    }

    if (!body.code || body.code.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        details: "Template code is required",
      });
      return;
    }

    // Extract only the updatable fields
    const updateData = {
      name: body.name.trim(),
      code: body.code.trim(),
      description: body.description,
      attribute_definitions: body.attribute_definitions,
      is_active: body.is_active,
    };

    const result =
      await productAttributesModuleService.updateAttributeTemplates({
        id,
        name: updateData.name,
        code: updateData.code,
        description: updateData.description,
        attribute_definitions: updateData.attribute_definitions as unknown as Record<
          string,
          unknown
        >,
        is_active: updateData.is_active,
      });

    const attributeTemplate = Array.isArray(result) ? result[0] : result;

    res.json({
      attribute_template: attributeTemplate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      error: "Failed to update attribute template",
      details: errorMessage,
    });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const productAttributesModuleService = req.scope.resolve(
    PRODUCT_ATTRIBUTES_MODULE
  );
  const { id } = req.params;

  await productAttributesModuleService.softDeleteAttributeTemplates([id]);

  res.status(200).json({
    id,
    object: "attribute_template",
    deleted: true,
  });
};
