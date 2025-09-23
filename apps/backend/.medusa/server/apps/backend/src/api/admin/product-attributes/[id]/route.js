"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.GET = void 0;
const product_attributes_1 = require("../../../../modules/product-attributes");
const GET = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { id } = req.params;
    const productAttribute = await productAttributesModuleService.retrieveProductAttribute(id);
    res.json({
        product_attribute: productAttribute,
    });
};
exports.GET = GET;
const PUT = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { id } = req.params;
    const updateData = req.body;
    const [productAttribute] = await productAttributesModuleService.updateProductAttributes([{
            id,
            ...updateData
        }]);
    res.json({
        product_attribute: productAttribute,
    });
};
exports.PUT = PUT;
const DELETE = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { id } = req.params;
    await productAttributesModuleService.softDeleteProductAttributes([id]);
    res.status(200).json({
        id,
        object: "product_attribute",
        deleted: true,
    });
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtYXR0cmlidXRlcy9baWRdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLCtFQUFrRjtBQUUzRSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhDQUF5QixDQUFDLENBQUE7SUFDbkYsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7SUFFekIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLDhCQUE4QixDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRTFGLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxpQkFBaUIsRUFBRSxnQkFBZ0I7S0FDcEMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBWlksUUFBQSxHQUFHLE9BWWY7QUFFTSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhDQUF5QixDQUFDLENBQUE7SUFDbkYsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7SUFFekIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLElBSXRCLENBQUE7SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxNQUFNLDhCQUE4QixDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDdkYsRUFBRTtZQUNGLEdBQUcsVUFBVTtTQUNkLENBQUMsQ0FBQyxDQUFBO0lBRUgsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNQLGlCQUFpQixFQUFFLGdCQUFnQjtLQUNwQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFyQlksUUFBQSxHQUFHLE9BcUJmO0FBRU0sTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUN6QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSw4QkFBOEIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw4Q0FBeUIsQ0FBQyxDQUFBO0lBQ25GLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO0lBRXpCLE1BQU0sOEJBQThCLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRXRFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ25CLEVBQUU7UUFDRixNQUFNLEVBQUUsbUJBQW1CO1FBQzNCLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBZFksUUFBQSxNQUFNLFVBY2xCIn0=