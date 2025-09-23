"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250901142911 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250901142911 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "attribute_option" drop column if exists "display_order";`);
        this.addSql(`alter table if exists "attribute_option" add column if not exists "group_name" text not null;`);
    }
    async down() {
        this.addSql(`alter table if exists "attribute_option" drop column if exists "group_name";`);
        this.addSql(`alter table if exists "attribute_option" add column if not exists "display_order" integer not null default 0;`);
    }
}
exports.Migration20250901142911 = Migration20250901142911;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MDExNDI5MTEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDkwMTE0MjkxMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsaUZBQWlGLENBQUMsQ0FBQztRQUUvRixJQUFJLENBQUMsTUFBTSxDQUFDLCtGQUErRixDQUFDLENBQUM7SUFDL0csQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsOEVBQThFLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsTUFBTSxDQUFDLCtHQUErRyxDQUFDLENBQUM7SUFDL0gsQ0FBQztDQUVGO0FBZEQsMERBY0MifQ==