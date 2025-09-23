"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250901145927 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250901145927 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "attribute_group" ("id" text not null, "group_name" text not null, "options" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_group_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_group_deleted_at" ON "attribute_group" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`drop table if exists "attribute_option" cascade;`);
    }
    async down() {
        this.addSql(`create table if not exists "attribute_option" ("id" text not null, "group_code" text not null, "group_name" text not null, "value" text not null, "metadata" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_option_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_option_deleted_at" ON "attribute_option" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`drop table if exists "attribute_group" cascade;`);
    }
}
exports.Migration20250901145927 = Migration20250901145927;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MDExNDU5MjcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDkwMTE0NTkyNy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsaVRBQWlULENBQUMsQ0FBQztRQUMvVCxJQUFJLENBQUMsTUFBTSxDQUFDLHlIQUF5SCxDQUFDLENBQUM7UUFFdkksSUFBSSxDQUFDLE1BQU0sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLDhZQUE4WSxDQUFDLENBQUM7UUFDNVosSUFBSSxDQUFDLE1BQU0sQ0FBQywySEFBMkgsQ0FBQyxDQUFDO1FBRXpJLElBQUksQ0FBQyxNQUFNLENBQUMsaURBQWlELENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBRUY7QUFoQkQsMERBZ0JDIn0=