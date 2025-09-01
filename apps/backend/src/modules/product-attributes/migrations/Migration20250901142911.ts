import { Migration } from '@mikro-orm/migrations';

export class Migration20250901142911 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "attribute_option" drop column if exists "display_order";`);

    this.addSql(`alter table if exists "attribute_option" add column if not exists "group_name" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "attribute_option" drop column if exists "group_name";`);

    this.addSql(`alter table if exists "attribute_option" add column if not exists "display_order" integer not null default 0;`);
  }

}
