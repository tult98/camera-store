"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const product_attributes_1 = require("../../../../modules/product-attributes");
const POST = async (req, res) => {
    const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const { attributes } = req.body;
    const updatedGroups = [];
    const createdGroups = [];
    // First, get all existing groups to check for duplicates by name
    const [existingGroups] = await productAttributesModuleService.listAndCountAttributeGroups({});
    const existingGroupsByName = new Map(existingGroups.map(g => [g.group_name.toLowerCase(), g]));
    for (const attribute of attributes) {
        const existingGroup = existingGroupsByName.get(attribute.group_name.toLowerCase());
        if (existingGroup) {
            // Update existing group
            const updated = await productAttributesModuleService.updateAttributeGroups({ id: existingGroup.id }, {
                options: attribute.options,
            });
            updatedGroups.push(Array.isArray(updated) ? updated[0] : updated);
        }
        else {
            // Create new group
            const group = await productAttributesModuleService.createAttributeGroups({
                group_name: attribute.group_name,
                options: attribute.options,
            });
            createdGroups.push(group);
        }
    }
    res.status(201).json({
        attribute_groups: [...updatedGroups, ...createdGroups],
        updated_count: updatedGroups.length,
        created_count: createdGroups.length,
        total_count: updatedGroups.length + createdGroups.length,
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2F0dHJpYnV0ZS1vcHRpb25zL2JhdGNoL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLCtFQUFrRjtBQVEzRSxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhDQUF5QixDQUFDLENBQUE7SUFFbkYsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUUxQixDQUFBO0lBRUQsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFBO0lBQ3hCLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQTtJQUV4QixpRUFBaUU7SUFDakUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sOEJBQThCLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDN0YsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsQ0FDbEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUN6RCxDQUFBO0lBRUQsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNuQyxNQUFNLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1FBRWxGLElBQUksYUFBYSxFQUFFLENBQUM7WUFDbEIsd0JBQXdCO1lBQ3hCLE1BQU0sT0FBTyxHQUFHLE1BQU0sOEJBQThCLENBQUMscUJBQXFCLENBQ3hFLEVBQUUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFDeEI7Z0JBQ0UsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUE2QzthQUNqRSxDQUNGLENBQUE7WUFDRCxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDbkUsQ0FBQzthQUFNLENBQUM7WUFDTixtQkFBbUI7WUFDbkIsTUFBTSxLQUFLLEdBQUcsTUFBTSw4QkFBOEIsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDdkUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVO2dCQUNoQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQTZDO2FBQ2pFLENBQUMsQ0FBQTtZQUNGLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNuQixnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLEdBQUcsYUFBYSxDQUFDO1FBQ3RELGFBQWEsRUFBRSxhQUFhLENBQUMsTUFBTTtRQUNuQyxhQUFhLEVBQUUsYUFBYSxDQUFDLE1BQU07UUFDbkMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU07S0FDekQsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBL0NZLFFBQUEsSUFBSSxRQStDaEIifQ==