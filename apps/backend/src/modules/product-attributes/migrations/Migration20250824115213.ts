import { Migration } from '@mikro-orm/migrations';

export class Migration20250824115213 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "attribute_option" ("id" text not null, "group_code" text not null, "value" text not null, "label" text not null, "display_order" integer not null default 0, "metadata" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_option_deleted_at" ON "attribute_option" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "attribute_template" ("id" text not null, "name" text not null, "code" text not null, "product_type" text check ("product_type" in ('camera', 'lens', 'accessory')) not null, "description" text null, "attribute_definitions" jsonb not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_template_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_template_deleted_at" ON "attribute_template" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_attribute" ("id" text not null, "product_id" text not null, "template_id" text not null, "attribute_values" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_attribute_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_attribute_deleted_at" ON "product_attribute" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "attribute_option" cascade;`);

    this.addSql(`drop table if exists "attribute_template" cascade;`);

    this.addSql(`drop table if exists "product_attribute" cascade;`);
  }

}
