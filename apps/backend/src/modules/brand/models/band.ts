import { model } from '@medusajs/framework/utils';

export const Brand = model.define('brand', {
  id: model.id().primaryKey(),
  name: model.text(),
  image_url: model.text().nullable(),
});
