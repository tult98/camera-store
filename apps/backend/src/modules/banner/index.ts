import { Module } from '@medusajs/framework/utils';
import BannerModuleService from 'src/modules/banner/service';

export const BANNER_MODULE = 'banner';

export default Module(BANNER_MODULE, {
  service: BannerModuleService,
});
