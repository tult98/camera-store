"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePriceStep = calculatePriceStep;
exports.calculateStep = calculateStep;
/**
 * Calculate appropriate step size for price range sliders
 * Based on the price range, returns a sensible step increment
 */
function calculatePriceStep(min, max) {
    const range = max - min;
    if (range <= 100)
        return 5;
    if (range <= 500)
        return 10;
    if (range <= 1000)
        return 25;
    if (range <= 5000)
        return 50;
    return 100;
}
/**
 * Calculate appropriate step size for generic numeric range sliders
 * Used for attribute facets with numeric values
 */
function calculateStep(min, max) {
    const range = max - min;
    if (range <= 10)
        return 1;
    if (range <= 100)
        return 5;
    if (range <= 1000)
        return 10;
    return 50;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQtY2FsY3VsYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWF0dHJpYnV0ZXMvdXRpbHMvZmFjZXQtY2FsY3VsYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxnREFPQztBQU1ELHNDQU1DO0FBdkJEOzs7R0FHRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLEdBQVcsRUFBRSxHQUFXO0lBQ3pELE1BQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDeEIsSUFBSSxLQUFLLElBQUksR0FBRztRQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLElBQUksS0FBSyxJQUFJLEdBQUc7UUFBRSxPQUFPLEVBQUUsQ0FBQztJQUM1QixJQUFJLEtBQUssSUFBSSxJQUFJO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFDN0IsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzdCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxHQUFXLEVBQUUsR0FBVztJQUNwRCxNQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLElBQUksS0FBSyxJQUFJLEVBQUU7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxQixJQUFJLEtBQUssSUFBSSxHQUFHO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0IsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzdCLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyJ9