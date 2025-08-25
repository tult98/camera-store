import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../modules/product-attributes";

interface CreateAttributeTemplateRequest {
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
  is_active?: boolean;
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productAttributesModuleService = req.scope.resolve(
    PRODUCT_ATTRIBUTES_MODULE
  );

  const limit = parseInt(req.query["limit"] as string) || 20;
  const offset = parseInt(req.query["offset"] as string) || 0;

  const [templates, count] =
    await productAttributesModuleService.listAndCountAttributeTemplates(
      {},
      {
        take: limit,
        skip: offset,
      }
    );

  res.json({
    attribute_templates: templates,
    count,
    limit,
    offset,
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productAttributesModuleService = req.scope.resolve(
    PRODUCT_ATTRIBUTES_MODULE
  );

  try {
    const body = req.body as CreateAttributeTemplateRequest;

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

    const attributeTemplate =
      await productAttributesModuleService.createAttributeTemplates({
        name: body.name.trim(),
        code: body.code.trim(),
        description: body.description,
        attribute_definitions: (body.attribute_definitions ||
          []) as unknown as Record<string, unknown>,
        is_active: body.is_active ?? true,
      });

    res.status(201).json({
      attribute_template: attributeTemplate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      error: "Failed to create attribute template",
      details: errorMessage,
    });
  }
};
