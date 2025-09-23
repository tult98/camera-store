"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@medusajs/framework/utils");
const models_1 = require("./models");
const facet_aggregation_service_1 = tslib_1.__importDefault(require("./services/facet-aggregation.service"));
class ProductAttributesModuleService extends (0, utils_1.MedusaService)({
    AttributeTemplate: models_1.AttributeTemplate,
    ProductAttribute: models_1.ProductAttribute,
    AttributeGroup: models_1.AttributeGroup,
}) {
    constructor(container) {
        super(...arguments);
        this.facetAggregationService_ = new facet_aggregation_service_1.default(container);
    }
    getFacetAggregationService() {
        return this.facetAggregationService_;
    }
}
exports.default = ProductAttributesModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtYXR0cmlidXRlcy9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUF5RDtBQUN6RCxxQ0FBOEU7QUFDOUUsNkdBQTBFO0FBRTFFLE1BQU0sOEJBQStCLFNBQVEsSUFBQSxxQkFBYSxFQUFDO0lBQ3pELGlCQUFpQixFQUFqQiwwQkFBaUI7SUFDakIsZ0JBQWdCLEVBQWhCLHlCQUFnQjtJQUNoQixjQUFjLEVBQWQsdUJBQWM7Q0FDZixDQUFDO0lBR0EsWUFBWSxTQUFjO1FBQ3hCLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLG1DQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3hFLENBQUM7SUFFRCwwQkFBMEI7UUFDeEIsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUE7SUFDdEMsQ0FBQztDQUNGO0FBRUQsa0JBQWUsOEJBQThCLENBQUEifQ==