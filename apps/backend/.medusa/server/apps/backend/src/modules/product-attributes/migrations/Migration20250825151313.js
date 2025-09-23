"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250825151313 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250825151313 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "attribute_option" drop column if exists "label";`);
    }
    async down() {
        this.addSql(`alter table if exists "attribute_option" add column if not exists "label" text not null;`);
    }
}
exports.Migration20250825151313 = Migration20250825151313;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MjUxNTEzMTMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDgyNTE1MTMxMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMseUVBQXlFLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO0lBQzFHLENBQUM7Q0FFRjtBQVZELDBEQVVDIn0=