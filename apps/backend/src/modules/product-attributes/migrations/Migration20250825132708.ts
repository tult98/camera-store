import { Migration } from '@mikro-orm/migrations';

export class Migration20250825132708 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "attribute_template" drop column if exists "product_type";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "attribute_template" add column if not exists "product_type" text check ("product_type" in ('camera', 'lens', 'accessory')) not null;`);
  }

}
