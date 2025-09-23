"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const AttributeTemplate = utils_1.model.define("attribute_template", {
    id: utils_1.model.id().primaryKey(),
    name: utils_1.model.text().searchable(),
    code: utils_1.model.text().searchable(),
    description: utils_1.model.text().nullable(),
    attribute_definitions: utils_1.model.json(),
    is_active: utils_1.model.boolean().default(true),
});
exports.default = AttributeTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLXRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJvZHVjdC1hdHRyaWJ1dGVzL21vZGVscy9hdHRyaWJ1dGUtdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUE0RGpELE1BQU0saUJBQWlCLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRTtJQUMzRCxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixJQUFJLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMvQixJQUFJLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMvQixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxxQkFBcUIsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ25DLFNBQVMsRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztDQUN6QyxDQUFDLENBQUE7QUFFRixrQkFBZSxpQkFBaUIsQ0FBQSJ9