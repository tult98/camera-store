"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const product_attributes_1 = require("../../../modules/product-attributes");
const GET = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const limit = parseInt(req.query['limit']) || 20;
    const offset = parseInt(req.query['offset']) || 0;
    const product_id = req.query['product_id'];
    const template_id = req.query['template_id'];
    const filters = {};
    if (product_id)
        filters.product_id = product_id;
    if (template_id)
        filters.template_id = template_id;
    const [productAttributes, count] = await productAttributesModuleService.listAndCountProductAttributes(filters, {
        take: limit,
        skip: offset,
    });
    res.json({
        product_attributes: productAttributes,
        count,
        limit,
        offset,
    });
};
exports.GET = GET;
const POST = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { product_id, template_id, attribute_values } = req.body;
    const productAttribute = await productAttributesModuleService.createProductAttributes({
        product_id,
        template_id,
        attribute_values,
    });
    res.status(201).json({
        product_attribute: productAttribute,
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtYXR0cmlidXRlcy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSw0RUFBK0U7QUFFeEUsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSw4QkFBOEIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw4Q0FBeUIsQ0FBQyxDQUFBO0lBRW5GLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBVyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzFELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzNELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFXLENBQUE7SUFDcEQsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQVcsQ0FBQTtJQUV0RCxNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUE7SUFDdkIsSUFBSSxVQUFVO1FBQUUsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7SUFDL0MsSUFBSSxXQUFXO1FBQUUsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7SUFFbEQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sOEJBQThCLENBQUMsNkJBQTZCLENBQ25HLE9BQU8sRUFDUDtRQUNFLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLE1BQU07S0FDYixDQUNGLENBQUE7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1Asa0JBQWtCLEVBQUUsaUJBQWlCO1FBQ3JDLEtBQUs7UUFDTCxLQUFLO1FBQ0wsTUFBTTtLQUNQLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQTdCWSxRQUFBLEdBQUcsT0E2QmY7QUFFTSxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhDQUF5QixDQUFDLENBQUE7SUFFbkYsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFJekQsQ0FBQTtJQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSw4QkFBOEIsQ0FBQyx1QkFBdUIsQ0FBQztRQUNwRixVQUFVO1FBQ1YsV0FBVztRQUNYLGdCQUFnQjtLQUNqQixDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNuQixpQkFBaUIsRUFBRSxnQkFBZ0I7S0FDcEMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBckJZLFFBQUEsSUFBSSxRQXFCaEIifQ==