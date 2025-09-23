"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("@medusajs/framework/http");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const route_1 = require("./store/category-products/route");
const staticMiddleware = (req, res, next) => {
    // Serve static files from the /static directory
    const staticPath = path_1.default.join(process.cwd(), "static");
    return express_1.default.static(staticPath)(req, res, next);
};
const config = {
    routes: [
        {
            matcher: "/static/*",
            middlewares: [staticMiddleware],
        },
        {
            matcher: "/store/category-products",
            method: "POST",
            middlewares: [
                (0, http_1.validateAndTransformBody)(route_1.CategoryProductsSchema),
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU1BLG1EQUFtRTtBQUNuRSw4REFBNkI7QUFDN0Isd0RBQXVCO0FBQ3ZCLDJEQUF3RTtBQUV4RSxNQUFNLGdCQUFnQixHQUFHLENBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLElBQXdCLEVBQ3hCLEVBQUU7SUFDRixnREFBZ0Q7SUFDaEQsTUFBTSxVQUFVLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDckQsT0FBTyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFVLEVBQUUsR0FBVSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pFLENBQUMsQ0FBQTtBQUVELE1BQU0sTUFBTSxHQUFzQjtJQUNoQyxNQUFNLEVBQUU7UUFDTjtZQUNFLE9BQU8sRUFBRSxXQUFXO1lBQ3BCLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1NBQ2hDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFO2dCQUNYLElBQUEsK0JBQXdCLEVBQUMsOEJBQTZCLENBQUM7YUFDeEQ7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLE1BQU0sQ0FBQSJ9