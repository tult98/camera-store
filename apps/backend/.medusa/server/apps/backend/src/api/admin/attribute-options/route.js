"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const product_attributes_1 = require("../../../modules/product-attributes");
const GET = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const [groups, count] = await productAttributesModuleService.listAndCountAttributeGroups({}, {
        order: { group_name: "ASC" },
    });
    res.json({
        attribute_groups: groups,
        count,
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2F0dHJpYnV0ZS1vcHRpb25zL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLDRFQUErRTtBQUV4RSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhDQUF5QixDQUFDLENBQUE7SUFFbkYsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLDhCQUE4QixDQUFDLDJCQUEyQixDQUN0RixFQUFFLEVBQ0Y7UUFDRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFO0tBQzdCLENBQ0YsQ0FBQTtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxnQkFBZ0IsRUFBRSxNQUFNO1FBQ3hCLEtBQUs7S0FDTixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFqQlksUUFBQSxHQUFHLE9BaUJmIn0=