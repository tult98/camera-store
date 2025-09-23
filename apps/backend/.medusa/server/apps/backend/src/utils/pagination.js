"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPaginatedResponse = toPaginatedResponse;
/**
 * Converts query results to the standard PaginatedResponse format
 * @param data - The array of items to paginate
 * @param count - The total count of items
 * @param limit - The maximum number of items per page
 * @param offset - The number of items to skip
 * @param estimate_count - Optional estimated count from query planner
 * @returns PaginatedResponse with the provided data
 */
function toPaginatedResponse(data, count, limit, offset, estimate_count) {
    return {
        items: data,
        count,
        limit,
        offset,
        ...(estimate_count !== undefined && { estimate_count }),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9wYWdpbmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBV0Esa0RBY0M7QUF2QkQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixtQkFBbUIsQ0FDakMsSUFBUyxFQUNULEtBQWEsRUFDYixLQUFhLEVBQ2IsTUFBYyxFQUNkLGNBQXVCO0lBRXZCLE9BQU87UUFDTCxLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUs7UUFDTCxLQUFLO1FBQ0wsTUFBTTtRQUNOLEdBQUcsQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUM7S0FDeEQsQ0FBQztBQUNKLENBQUMifQ==