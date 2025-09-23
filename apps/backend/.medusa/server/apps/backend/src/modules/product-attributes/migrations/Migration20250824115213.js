"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250824115213 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250824115213 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "attribute_option" ("id" text not null, "group_code" text not null, "value" text not null, "label" text not null, "display_order" integer not null default 0, "metadata" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_option_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_option_deleted_at" ON "attribute_option" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`create table if not exists "attribute_template" ("id" text not null, "name" text not null, "code" text not null, "product_type" text check ("product_type" in ('camera', 'lens', 'accessory')) not null, "description" text null, "attribute_definitions" jsonb not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_template_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_template_deleted_at" ON "attribute_template" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`create table if not exists "product_attribute" ("id" text not null, "product_id" text not null, "template_id" text not null, "attribute_values" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_attribute_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_attribute_deleted_at" ON "product_attribute" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "attribute_option" cascade;`);
        this.addSql(`drop table if exists "attribute_template" cascade;`);
        this.addSql(`drop table if exists "product_attribute" cascade;`);
    }
}
exports.Migration20250824115213 = Migration20250824115213;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MjQxMTUyMTMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDgyNDExNTIxMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMscWJBQXFiLENBQUMsQ0FBQztRQUNuYyxJQUFJLENBQUMsTUFBTSxDQUFDLDJIQUEySCxDQUFDLENBQUM7UUFFekksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpZkFBaWYsQ0FBQyxDQUFDO1FBQy9mLElBQUksQ0FBQyxNQUFNLENBQUMsK0hBQStILENBQUMsQ0FBQztRQUU3SSxJQUFJLENBQUMsTUFBTSxDQUFDLDJWQUEyVixDQUFDLENBQUM7UUFDelcsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2SEFBNkgsQ0FBQyxDQUFDO0lBQzdJLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1FBRWxFLElBQUksQ0FBQyxNQUFNLENBQUMsbURBQW1ELENBQUMsQ0FBQztJQUNuRSxDQUFDO0NBRUY7QUFyQkQsMERBcUJDIn0=