"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const product_attributes_1 = require("../../../modules/product-attributes");
const GET = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const limit = parseInt(req.query["limit"]) || 20;
    const offset = parseInt(req.query["offset"]) || 0;
    const [templates, count] = await productAttributesModuleService.listAndCountAttributeTemplates({}, {
        take: limit,
        skip: offset,
    });
    res.json({
        attribute_templates: templates,
        count,
        limit,
        offset,
    });
};
exports.GET = GET;
const POST = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    try {
        const body = req.body;
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
        const attributeTemplate = await productAttributesModuleService.createAttributeTemplates({
            name: body.name.trim(),
            code: body.code.trim(),
            description: body.description,
            attribute_definitions: (body.attribute_definitions ||
                []),
            is_active: body.is_active ?? true,
        });
        res.status(201).json({
            attribute_template: attributeTemplate,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            error: "Failed to create attribute template",
            details: errorMessage,
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2F0dHJpYnV0ZS10ZW1wbGF0ZXMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNEVBQWdGO0FBNEJ6RSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSw4QkFBOEIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDdEQsOENBQXlCLENBQzFCLENBQUM7SUFFRixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1RCxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxHQUN0QixNQUFNLDhCQUE4QixDQUFDLDhCQUE4QixDQUNqRSxFQUFFLEVBQ0Y7UUFDRSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FDRixDQUFDO0lBRUosR0FBRyxDQUFDLElBQUksQ0FBQztRQUNQLG1CQUFtQixFQUFFLFNBQVM7UUFDOUIsS0FBSztRQUNMLEtBQUs7UUFDTCxNQUFNO0tBQ1AsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBdkJXLFFBQUEsR0FBRyxPQXVCZDtBQUVLLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNwRSxNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUN0RCw4Q0FBeUIsQ0FDMUIsQ0FBQztJQUVGLElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFzQyxDQUFDO1FBRXhELDJCQUEyQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNuQixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixPQUFPLEVBQUUsMkJBQTJCO2FBQ3JDLENBQUMsQ0FBQztZQUNILE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkIsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsT0FBTyxFQUFFLDJCQUEyQjthQUNyQyxDQUFDLENBQUM7WUFDSCxPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0saUJBQWlCLEdBQ3JCLE1BQU0sOEJBQThCLENBQUMsd0JBQXdCLENBQUM7WUFDNUQsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUN0QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQXFCO2dCQUNoRCxFQUFFLENBQXVDO1lBQzNDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUk7U0FDbEMsQ0FBQyxDQUFDO1FBRUwsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkIsa0JBQWtCLEVBQUUsaUJBQWlCO1NBQ3RDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxZQUFZLEdBQ2hCLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQztRQUUzRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixLQUFLLEVBQUUscUNBQXFDO1lBQzVDLE9BQU8sRUFBRSxZQUFZO1NBQ3RCLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUM7QUEvQ1csUUFBQSxJQUFJLFFBK0NmIn0=