import { MedusaService } from '@medusajs/framework/utils';
import Banner from 'src/modules/banner/models/banner';

class BannerModuleService extends MedusaService({
  Banner,
}) {}

export default BannerModuleService;