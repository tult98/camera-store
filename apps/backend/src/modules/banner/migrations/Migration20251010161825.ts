import { Migration } from '@mikro-orm/migrations';

export class Migration20251010161825 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "banner" ("id" text not null, "images" jsonb not null, "store_id" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_banner_deleted_at" ON "banner" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "banner" cascade;`);
  }

}
