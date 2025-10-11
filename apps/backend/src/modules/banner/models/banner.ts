import { model } from '@medusajs/framework/utils';

const Banner = model.define('banner', {
  id: model.id().primaryKey(),
  images: model.json(),
  is_active: model.boolean().default(true),
});

export default Banner;
