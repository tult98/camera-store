import { MedusaService } from "@medusajs/framework/utils";
import { AttributeGroup, AttributeTemplate, ProductAttribute } from "./models";
import FacetAggregationService from "./services/facet-aggregation.service";

class ProductAttributesModuleService extends MedusaService({
  AttributeTemplate,
  ProductAttribute,
  AttributeGroup,
}) {
  private facetAggregationService_: FacetAggregationService;

  constructor(container: any) {
    super(...arguments);
    this.facetAggregationService_ = new FacetAggregationService(container);
  }

  getFacetAggregationService(): FacetAggregationService {
    return this.facetAggregationService_;
  }
}

export default ProductAttributesModuleService;
