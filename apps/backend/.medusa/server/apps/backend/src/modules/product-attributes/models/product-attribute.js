"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const ProductAttribute = utils_1.model.define("product_attribute", {
    id: utils_1.model.id().primaryKey(),
    product_id: utils_1.model.text(),
    template_id: utils_1.model.text(),
    attribute_values: utils_1.model.json(),
});
exports.default = ProductAttribute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1hdHRyaWJ1dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvbW9kZWxzL3Byb2R1Y3QtYXR0cmlidXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQWlEO0FBRWpELE1BQU0sZ0JBQWdCLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtJQUN6RCxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN4QixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN6QixnQkFBZ0IsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0NBQy9CLENBQUMsQ0FBQTtBQUVGLGtCQUFlLGdCQUFnQixDQUFBIn0=