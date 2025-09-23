"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250825132708 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250825132708 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "attribute_template" drop column if exists "product_type";`);
    }
    async down() {
        this.addSql(`alter table if exists "attribute_template" add column if not exists "product_type" text check ("product_type" in ('camera', 'lens', 'accessory')) not null;`);
    }
}
exports.Migration20250825132708 = Migration20250825132708;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MjUxMzI3MDguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDgyNTEzMjcwOC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2SkFBNkosQ0FBQyxDQUFDO0lBQzdLLENBQUM7Q0FFRjtBQVZELDBEQVVDIn0=