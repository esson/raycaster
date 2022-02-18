import Vector from "./vector";
/**
 * Converts a spritesheet index to actual pixel coordinates, given all sprites are square.
 * @param {number} index The index of the image.
 * @param {number} cols The number of sprite columns in the sprite sheet.
 * @param {number} size The width/height of a sprite.
 * @returns 
 */
export function getSpritesheetCoordinates(index, cols = 16, size = 65) {
    return new Vector(index % cols, Math.floor(index / cols)).multiply(size);
}