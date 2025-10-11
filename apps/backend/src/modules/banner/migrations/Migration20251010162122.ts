import { Migration } from '@mikro-orm/migrations';

export class Migration20251010162122 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "banner" drop column if exists "store_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "banner" add column if not exists "store_id" text not null;`);
  }

}
