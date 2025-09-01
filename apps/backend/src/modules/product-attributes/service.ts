import { MedusaService } from "@medusajs/framework/utils"
import { AttributeTemplate, ProductAttribute, AttributeOption } from "./models"
import FacetAggregationService from "./services/facet-aggregation.service"

class ProductAttributesModuleService extends MedusaService({
  AttributeTemplate,
  ProductAttribute, 
  AttributeOption,
}) {
  private facetAggregationService_: FacetAggregationService

  constructor(container: any) {
    super(...arguments)
    this.facetAggregationService_ = new FacetAggregationService(this.__container__)
  }

  getFacetAggregationService(): FacetAggregationService {
    return this.facetAggregationService_
  }
}

export default ProductAttributesModuleService