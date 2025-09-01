import { Migration } from '@mikro-orm/migrations';

export class Migration20250901145927 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "attribute_group" ("id" text not null, "group_name" text not null, "options" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_group_deleted_at" ON "attribute_group" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`drop table if exists "attribute_option" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "attribute_option" ("id" text not null, "group_code" text not null, "group_name" text not null, "value" text not null, "metadata" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_option_deleted_at" ON "attribute_option" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`drop table if exists "attribute_group" cascade;`);
  }

}
