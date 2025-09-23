"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.GET = void 0;
const product_attributes_1 = require("../../../../modules/product-attributes");
const GET = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { id } = req.params;
    const attributeTemplate = await productAttributesModuleService.retrieveAttributeTemplate(id);
    res.json({
        attribute_template: attributeTemplate,
    });
};
exports.GET = GET;
const PUT = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { id } = req.params;
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
        // Extract only the updatable fields
        const updateData = {
            name: body.name.trim(),
            code: body.code.trim(),
            description: body.description,
            attribute_definitions: body.attribute_definitions,
            is_active: body.is_active,
        };
        const result = await productAttributesModuleService.updateAttributeTemplates({
            id,
            name: updateData.name,
            code: updateData.code,
            description: updateData.description,
            attribute_definitions: updateData.attribute_definitions,
            is_active: updateData.is_active,
        });
        const attributeTemplate = Array.isArray(result) ? result[0] : result;
        res.json({
            attribute_template: attributeTemplate,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            error: "Failed to update attribute template",
            details: errorMessage,
        });
    }
};
exports.PUT = PUT;
const DELETE = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { id } = req.params;
    await productAttributesModuleService.softDeleteAttributeTemplates([id]);
    res.status(200).json({
        id,
        object: "attribute_template",
        deleted: true,
    });
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2F0dHJpYnV0ZS10ZW1wbGF0ZXMvW2lkXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrRUFBbUY7QUFFNUUsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sOEJBQThCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3RELDhDQUF5QixDQUMxQixDQUFDO0lBQ0YsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFFMUIsTUFBTSxpQkFBaUIsR0FDckIsTUFBTSw4QkFBOEIsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVyRSxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1Asa0JBQWtCLEVBQUUsaUJBQWlCO0tBQ3RDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVpXLFFBQUEsR0FBRyxPQVlkO0FBNEJLLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUN0RCw4Q0FBeUIsQ0FDMUIsQ0FBQztJQUNGLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBRTFCLElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFzQyxDQUFDO1FBRXhELDJCQUEyQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNuQixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixPQUFPLEVBQUUsMkJBQTJCO2FBQ3JDLENBQUMsQ0FBQztZQUNILE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkIsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsT0FBTyxFQUFFLDJCQUEyQjthQUNyQyxDQUFDLENBQUM7WUFDSCxPQUFPO1FBQ1QsQ0FBQztRQUVELG9DQUFvQztRQUNwQyxNQUFNLFVBQVUsR0FBRztZQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3RCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM3QixxQkFBcUIsRUFBRSxJQUFJLENBQUMscUJBQXFCO1lBQ2pELFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUMxQixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQ1YsTUFBTSw4QkFBOEIsQ0FBQyx3QkFBd0IsQ0FBQztZQUM1RCxFQUFFO1lBQ0YsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJO1lBQ3JCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSTtZQUNyQixXQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVc7WUFDbkMscUJBQXFCLEVBQUUsVUFBVSxDQUFDLHFCQUdqQztZQUNELFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUztTQUNoQyxDQUFDLENBQUM7UUFFTCxNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXJFLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxrQkFBa0IsRUFBRSxpQkFBaUI7U0FDdEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLFlBQVksR0FDaEIsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBRTNELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxxQ0FBcUM7WUFDNUMsT0FBTyxFQUFFLFlBQVk7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUMsQ0FBQztBQTlEVyxRQUFBLEdBQUcsT0E4RGQ7QUFFSyxNQUFNLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDdEUsTUFBTSw4QkFBOEIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDdEQsOENBQXlCLENBQzFCLENBQUM7SUFDRixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUUxQixNQUFNLDhCQUE4QixDQUFDLDRCQUE0QixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV4RSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNuQixFQUFFO1FBQ0YsTUFBTSxFQUFFLG9CQUFvQjtRQUM1QixPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQWJXLFFBQUEsTUFBTSxVQWFqQiJ9