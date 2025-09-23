"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const AttributeGroup = utils_1.model.define("attribute_group", {
    id: utils_1.model.id().primaryKey(),
    group_name: utils_1.model.text(),
    options: utils_1.model.json(),
});
exports.default = AttributeGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJvZHVjdC1hdHRyaWJ1dGVzL21vZGVscy9hdHRyaWJ1dGUtZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFFakQsTUFBTSxjQUFjLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtJQUNyRCxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN4QixPQUFPLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtDQUN0QixDQUFDLENBQUE7QUFFRixrQkFBZSxjQUFjLENBQUEifQ==