"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidator = exports.ProductByHandleSchema = void 0;
const zod_1 = require("zod");
exports.ProductByHandleSchema = zod_1.z.object({
    handle: zod_1.z.string().min(1, "Handle is required").max(255).regex(/^[a-zA-Z0-9_-]+$/, "Handle can only contain letters, numbers, hyphens, and underscores"),
});
class ProductValidator {
    static validateHandle(handle) {
        if (!handle ||
            typeof handle !== "string" ||
            handle.trim() === "") {
            throw new Error("Valid product handle is required");
        }
        const sanitized = handle.trim().replace(/[^a-zA-Z0-9_-]/g, '');
        if (sanitized.length === 0 || sanitized.length > 255) {
            throw new Error("Invalid product handle format");
        }
        return sanitized;
    }
    static validateHeaders(headers) {
        const region_id = headers["region_id"];
        const currency_code = headers["currency_code"];
        if (!region_id || !currency_code) {
            throw new Error("region_id and currency_code headers are required");
        }
        return { region_id, currency_code };
    }
}
exports.ProductValidator = ProductValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMuc2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9wcm9kdWN0cy92YWxpZGF0aW9uL3Byb2R1Y3RzLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBd0I7QUFFWCxRQUFBLHFCQUFxQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDNUMsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FDNUQsa0JBQWtCLEVBQ2xCLG9FQUFvRSxDQUNyRTtDQUNGLENBQUMsQ0FBQztBQUVILE1BQWEsZ0JBQWdCO0lBQzNCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBZTtRQUNuQyxJQUNFLENBQUMsTUFBTTtZQUNQLE9BQU8sTUFBTSxLQUFLLFFBQVE7WUFDMUIsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFDcEIsQ0FBQztZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUvRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFnQztRQUlyRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFXLENBQUM7UUFDakQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBVyxDQUFDO1FBRXpELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVELE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUM7SUFDdEMsQ0FBQztDQUNGO0FBaENELDRDQWdDQyJ9