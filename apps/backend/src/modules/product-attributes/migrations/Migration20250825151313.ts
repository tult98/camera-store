import { Migration } from '@mikro-orm/migrations';

export class Migration20250825151313 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "attribute_option" drop column if exists "label";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "attribute_option" add column if not exists "label" text not null;`);
  }

}
