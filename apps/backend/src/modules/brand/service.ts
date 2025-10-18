import { MedusaService } from '@medusajs/framework/utils';
import { Brand } from 'src/modules/brand/models/band';

class BrandModuleService extends MedusaService({
  Brand,
}) {}

export default BrandModuleService;
