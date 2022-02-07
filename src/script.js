import './styles.css';
import Vector from './vector';
import LEVEL_1 from './level-1'
import fps from './fps'
import PerformanceCounter from './performance-counter';

// Constants
//

const PI = Math.PI;
const DOUBLE_PI = PI * 2;
const HALF_PI = PI / 2;
const DEG_TO_PI = PI / 180;

const SCREEN_SCALE = 2.25;
const SCREEN_WIDTH = 640 * SCREEN_SCALE;
const SCREEN_HEIGHT = 480 * SCREEN_SCALE;

const SCREEN_SAFEZONE = 10;

const FOV = 70 * DEG_TO_PI;
const WALL_HEIGHT = SCREEN_HEIGHT / 240;
const SPRITE_SIZE = 64;

const CEILING_COLOR = '#333';
const FLOOR_COLOR = '#777';

const OSD_COLOR = '#0f0';
const OSD_FONT = '20px sans-serif';

const MOVE_SLOW = .02;
const MOVE_NORMAL = .04;
const MOVE_FAST = .06;

const TURN_RADIUS = DEG_TO_PI * 1.5;

const MINIMAP_ALPHA = .9;
const MINIMAP_CELLRADIUS = 12;
const MINIMAP_RAYS = false;
const MINIMAP_NONE = 0;
const MINIMAP_SMALL = 1;
const MINIMAP_LARGE = 2;

const PERFORMANCE_WIDTH = SCREEN_WIDTH / 3 * 2;
const PERFORMANCE_HEIGHT = 75;
const PERFORMANCE_X = SCREEN_WIDTH - PERFORMANCE_WIDTH - 10;
const PERFORMANCE_Y = SCREEN_HEIGHT - (PERFORMANCE_HEIGHT + 5) * 2 - 10;

const PLAYER_DEFAULT = {
    x: 30.5,
    y: 50.5,
    angle: 0,
    speed: 0,
    side: 0
};

// Settings
//

let SHOW_FPS = JSON.parse(localStorage.getItem('SHOW_FPS')) ?? true;
let SHOW_PERF = JSON.parse(localStorage.getItem('SHOW_PERF')) ?? true;
let SHOW_COORDINATES = JSON.parse(localStorage.getItem('SHOW_COORDINATES')) ?? true;
let RENDER_SPRITES = JSON.parse(localStorage.getItem('RENDER_SPRITES')) ?? true;
let INTERLACED_RENDERING = JSON.parse(localStorage.getItem('INTERLACED_RENDERING')) ?? true;

// Level
//

const currentLevel = {
    wallMap: null,
    walls: null,
    doorMap: null,
    doors: null,
    objectMap: null,
    objects: null,
    spriteUrl: '',
    spawn: new Vector(30.5, 50.5)
};

const MAP = LEVEL_1.map;
const MAP_LEGEND = LEVEL_1.legend;
const DOOR_MAP = LEVEL_1.doors;
const DOOR_MAP_LEGEND = LEVEL_1.doorsLegend;
const OBJECTS_MAP = LEVEL_1.objects;
const OBJECTS_MAP_LEGEND = LEVEL_1.objectsLegend;

const OBJECTS = OBJECTS_MAP.flatMap((row, y) => row.map((item, x) => ({
    id: item,
    x: x + .5,
    y: y + .5,
    ...OBJECTS_MAP_LEGEND[item]
}))).filter(x => x.id);

const spritesImage = new Image();
spritesImage.src = LEVEL_1.spriteUrl;

/**
 * @type HTMLCanvasElement
 */
var canvas = document.getElementById('canvas');
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let statusText = null;
let statusTimeoutId;

function clearStatusText() {
    statusText = null;
}

function setStatusText(text) {
    statusText = text;

    if (statusTimeoutId) {
        clearTimeout(statusTimeoutId);
    }

    statusTimeoutId = setTimeout(clearStatusText, 1500);
}

const controls = {
    up: false,
    down: false,
    left: false,
    right: false,
    turbo: false,
    stealth: false,
    strafe: false,
    map: MINIMAP_SMALL,
    action: false,
    pause: false
};

const controlsKeyboardMap = {
    KeyW: 'up',
    KeyA: 'left',
    KeyS: 'down',
    KeyD: 'right',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ShiftLeft: 'turbo',
    Space: 'action'
};

const controlsKeyboardToggleMap = {
    KeyP: 'pause'
};

const controlsKeyboardSpecialMap = {
    // Toggle Mini-Map
    KeyM: () => {
        switch (controls.map) {
            case MINIMAP_NONE:
                controls.map = MINIMAP_SMALL;
                break;
            case MINIMAP_SMALL:
                controls.map = MINIMAP_LARGE;
                break;
            case MINIMAP_LARGE:
                controls.map = MINIMAP_SMALL; // Never toggle to SMALL for now
                break;
        }
    },
    // Toggle FPS
    KeyU: () => SHOW_FPS = !SHOW_FPS,
    // Toggle Performance
    KeyC: () => SHOW_PERF = !SHOW_PERF,
    // Toggle Interlacing
    KeyI: () => {
        INTERLACED_RENDERING = !INTERLACED_RENDERING
        setStatusText('INTERLACING ' + (INTERLACED_RENDERING ? 'ON' : 'OFF'));
    },
    // Toggle Sprites
    KeyO: () => {
        RENDER_SPRITES = !RENDER_SPRITES
        setStatusText('SPRITES ' + (RENDER_SPRITES ? 'ON' : 'OFF'));
    },
    // Reset
    KeyR: () => player = { ...PLAYER_DEFAULT },
    // Toggle Smoothing
    KeyL: () => ctx.imageSmoothingEnabled = !ctx.imageSmoothingEnabled
}

document.addEventListener('keydown', (e) => {
    // Set true by keyboard map
    if (e.code in controlsKeyboardMap) {
        controls[controlsKeyboardMap[e.code]] = true;
    }
});

document.addEventListener('keyup', (e) => {
    // Set false by keyboard map
    if (e.code in controlsKeyboardMap) {
        controls[controlsKeyboardMap[e.code]] = false;
    }
    // Toggle true/false by keyboard map
    if (e.code in controlsKeyboardToggleMap) {
        controls[controlsKeyboardToggleMap[e.code]] = !controls[controlsKeyboardToggleMap[e.code]];
    }
    // Map to special logic
    if (e.code in controlsKeyboardSpecialMap) {
        controlsKeyboardSpecialMap[e.code]();
    }
});

window.addEventListener('unload', (e) => {
    localStorage.setItem('player', JSON.stringify(player));
    localStorage.setItem('SHOW_FPS', JSON.stringify(SHOW_FPS));
    localStorage.setItem('INTERLACED_RENDERING', JSON.stringify(INTERLACED_RENDERING));
    localStorage.setItem('RENDER_SPRITES', JSON.stringify(RENDER_SPRITES));
});

let player = JSON.parse(localStorage.getItem('player')) ?? { ...PLAYER_DEFAULT };

/**
 * Increases on each frame, used to render with interlaced vertical lines.
 */
let frameCounter = 0;
let last = performance.now();

const calcPerf = new PerformanceCounter('Calculations');
const drawPerf = new PerformanceCounter('Drawing');

function loop() {

    const now = performance.now();
    const delta = now - last;

    last = now;
    frameCounter++;

    try {
        if (!controls.pause) {

            let rays;

            // Calculations
            // ------------------------------
            calcPerf.start();

            update(delta);
            rays = getRays(player);

            calcPerf.stop();

            // Render
            // ------------------------------
            drawPerf.start();

            render(rays);

            drawPerf.stop();

            // Render Performance Chart
            // ------------------------------
            if (SHOW_PERF) {
                calcPerf.draw(ctx, 'blue', 'white', PERFORMANCE_X, PERFORMANCE_Y, PERFORMANCE_WIDTH, PERFORMANCE_HEIGHT);
                drawPerf.draw(ctx, 'red', 'white', PERFORMANCE_X, PERFORMANCE_Y + PERFORMANCE_HEIGHT + SCREEN_SAFEZONE, PERFORMANCE_WIDTH, PERFORMANCE_HEIGHT);
            }
        }

        requestAnimationFrame(loop);
    } catch (error) {
        throw error;
    }
}

function update(delta) {
    movePlayer(delta);
}

function render(rays) {

    drawScene(rays);
    drawObjects(rays, OBJECTS);

    if (controls.map > MINIMAP_NONE) {
        drawMiniMap(MAP, rays, controls.map === MINIMAP_LARGE);
    }

    if (SHOW_FPS) {
        drawFps(fps.tick());
    }

    if (statusText) {
        drawStatusText(statusText);
    }

    if (SHOW_COORDINATES) {
        drawCoordinates();
    }
}

function startGame() {
    requestAnimationFrame(loop);
}

/**
 * Keeps the angle between -Math.PI and Math.PI. Required to be able to compare angles.
 * @param {number} angle 
 */
function fixAngle(angle) {

    if (angle < -PI) {
        return angle + DOUBLE_PI;
    }
    if (angle > PI) {
        return angle - DOUBLE_PI;
    }
    return angle;
}

function viewCorrection(distance, viewAngle, playerAngle) {
    const difference = viewAngle - playerAngle;
    return distance * Math.cos(difference);
}

function isOutOfBounds(sx, sy, dw, dh) {
    return sx < 0 || sx >= dw || sy < 0 || sy >= dh;
}

function getHorizontalCollision(angle, player) {

    const up = Math.abs(Math.floor(angle / PI) % 2) > 0;

    const mapY = up ? Math.floor(player.y) : Math.floor(player.y) + 1;
    const mapX = player.x + (mapY - player.y) / Math.tan(angle);

    const stepY = up ? -1 : 1;
    const stepX = stepY / Math.tan(angle);

    const halfStepX = stepX / 2;
    const halfStepY = halfStepX * Math.tan(angle);

    let wall;
    let door;
    let nextX = mapX;
    let nextY = mapY;

    let color;
    let sprite;

    while (!wall && !door) {
        const cellX = Math.floor(nextX);
        const cellY = up ? Math.floor(nextY) - 1 : Math.floor(nextY);

        if (isOutOfBounds(cellX, cellY, MAP[0].length, MAP.length)) {
            color = MAP_LEGEND[0]?.darkColor;
            sprite = MAP_LEGEND[0]?.darkSprite;
            break;
        }

        wall = MAP[cellY][cellX];

        if (wall) {
            // If cell is adjacent to wall, we render door frame
            let adjacentDoor = up ? DOOR_MAP[cellY + 1][cellX] : DOOR_MAP[cellY - 1][cellX];

            if (adjacentDoor) {
                color = DOOR_MAP_LEGEND[adjacentDoor]?.frameDarkColor;
                sprite = DOOR_MAP_LEGEND[adjacentDoor]?.frameDarkSprite;
            } else {
                color = MAP_LEGEND[wall]?.darkColor;
                sprite = MAP_LEGEND[wall]?.darkSprite;
            }

            break;
        }

        door = DOOR_MAP[cellY][cellX];

        // Special logic for the doors, they are inset by half step
        if (door && door % 2 !== 0) { // If door is even, it is open
            color = DOOR_MAP_LEGEND[door]?.darkColor;
            sprite = DOOR_MAP_LEGEND[door]?.darkSprite;

            if (DOOR_MAP_LEGEND[door].inset) {
                nextX += halfStepX;
                nextY += halfStepY;
            }

            break;
        } else {
            door = undefined;
        }

        nextX += stepX;
        nextY += stepY;
    }

    return {
        angle,
        distance: Vector.distance(player.x, player.y, nextX, nextY),
        color: color,
        sprite: sprite,
        spriteX: (nextX - Math.floor(nextX)) * SPRITE_SIZE,
        vertical: false
    };
}

function getVerticalCollision(angle, player) {

    const right = Math.abs(Math.floor((angle - HALF_PI) / PI) % 2) > 0;

    const mapX = right ? Math.floor(player.x) + 1 : Math.floor(player.x);
    const mapY = player.y + (mapX - player.x) * Math.tan(angle);

    const stepX = right ? 1 : -1;
    const stepY = stepX * Math.tan(angle);

    const halfStepX = stepX / 2;
    const halfStepY = halfStepX * Math.tan(angle);

    let wall;
    let door;
    let nextX = mapX;
    let nextY = mapY;

    let color;
    let sprite;

    while (!wall && !door) {
        const cellX = right ? Math.floor(nextX) : Math.floor(nextX) - 1;;
        const cellY = Math.floor(nextY);

        if (isOutOfBounds(cellX, cellY, MAP[0].length, MAP.length)) {
            color = MAP_LEGEND[0]?.color;
            sprite = MAP_LEGEND[0]?.sprite;
            break;
        }

        wall = MAP[cellY][cellX];

        if (wall) {
            // If cell is adjacent to wall, we render door opening
            let adjacentDoor = right ? DOOR_MAP[cellY][cellX - 1] : DOOR_MAP[cellY][cellX + 1];

            if (adjacentDoor) {
                color = DOOR_MAP_LEGEND[adjacentDoor]?.frameColor;
                sprite = DOOR_MAP_LEGEND[adjacentDoor]?.frameSprite;
            } else {
                color = MAP_LEGEND[wall]?.color;
                sprite = MAP_LEGEND[wall]?.sprite;
            }

            break;
        }

        door = DOOR_MAP[cellY][cellX];

        // Special logic for the doors, they are inset by half step
        if (door && door % 2 !== 0) { // If door is even, it is open
            color = DOOR_MAP_LEGEND[door]?.color;
            sprite = DOOR_MAP_LEGEND[door]?.sprite;

            if (DOOR_MAP_LEGEND[door].inset) {
                nextX += halfStepX;
                nextY += halfStepY;
            }

            break;
        } else {
            door = undefined;
        }

        nextX += stepX;
        nextY += stepY;
    }

    return {
        angle,
        distance: Vector.distance(player.x, player.y, nextX, nextY),
        color: color,
        sprite: sprite,
        spriteX: (nextY - Math.floor(nextY)) * SPRITE_SIZE,
        vertical: true
    };
}

function getRays(player) {

    const start = player.angle - FOV / 2;
    const length = SCREEN_WIDTH;
    const step = FOV / length;
    const rays = [];

    for (let i = 0; i < length; i++) {
        const angle = start + step * i;
        const hCollision = getHorizontalCollision(angle, player);
        const vCollision = getVerticalCollision(angle, player);

        rays.push(hCollision.distance > vCollision.distance ? vCollision : hCollision);
    }

    return rays;
}

function movePlayer(delta) {

    // At 100 fps, delta is 10.
    const timeScale = 10 / delta;

    // Speed

    if (controls.up) {
        if (controls.turbo) {
            player.speed = MOVE_FAST * timeScale;
        } else {
            player.speed = MOVE_NORMAL * timeScale;
        }
    }

    if (controls.down) {
        player.speed = -MOVE_SLOW * timeScale;
    }

    if (!controls.up && !controls.down) {
        player.speed = 0;
    }

    // Strafe

    if (controls.strafe) {
        if (controls.left) {
            player.side = MOVE_SLOW * timeScale;
        }

        if (controls.right) {
            player.side = -MOVE_SLOW * timeScale;
        }

        if (!controls.left && !controls.right) {
            player.side = 0;
        }
    }


    // Turning

    if (!controls.strafe) {
        if (controls.left) {
            player.angle = fixAngle(player.angle - TURN_RADIUS * timeScale);
        }
        if (controls.right) {
            player.angle = fixAngle(player.angle + TURN_RADIUS * timeScale);
        }
    }

    if (controls.action) {
        let doorX = Math.floor(player.x + Math.cos(player.angle));
        let doorY = Math.floor(player.y + Math.sin(player.angle));

        if (DOOR_MAP[doorY][doorX] === 1) {
            DOOR_MAP[doorY][doorX] = 2;

            const autoClose = () => {
                setTimeout(() => {
                    // Make sure player isn't standing in door way.
                    const x = Math.floor(player.x);
                    const y = Math.floor(player.y);

                    if (y === doorY && x === doorX) {
                        autoClose();
                        return;
                    }
                    DOOR_MAP[doorY][doorX] = 1
                }, 3000);
            };

            autoClose();

        }

        controls.action == false;
    }

    if (player.speed !== 0) {

        let moveX = Math.cos(player.angle) * player.speed;
        let moveY = Math.sin(player.angle) * player.speed;

        if (!isIntersectingWall(player.x + moveX, player.y)) {
            player.x += moveX;
        }
        if (!isIntersectingWall(player.x, player.y + moveY)) {
            player.y += moveY;
        }
    }

    if (player.side !== 0) {

        let moveX = Math.cos(player.angle - HALF_PI) * player.side;
        let moveY = Math.sin(player.angle - HALF_PI) * player.side;

        if (!isIntersectingWall(player.x + moveX, player.y)) {
            player.x += moveX;
        }
        if (!isIntersectingWall(player.x, player.y + moveY)) {
            player.y += moveY;
        }
    }
}

function isIntersectingWall(x, y) {
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);

    const wall = MAP[mapY][mapX];

    if (wall) {
        return true;
    }

    const door = DOOR_MAP[mapY][mapX];

    if (door > 0 && door % 2 !== 0) {
        return true;
    }

    return false;
}

function drawScene(rays) {

    let i = INTERLACED_RENDERING && frameCounter % 2 === 0 ? 1 : 0;
    let increment = INTERLACED_RENDERING ? 2 : 1;

    const length = rays.length;

    for (; i < length; i += increment) {

        const ray = rays[i];

        const distance = viewCorrection(ray.distance, ray.angle, player.angle);
        const height = WALL_HEIGHT / distance * 277;
        const y = SCREEN_HEIGHT / 2 - height / 2;

        // Ceiling
        ctx.fillStyle = CEILING_COLOR;
        ctx.fillRect(i, 0, 1, y);

        // Floor
        ctx.fillStyle = FLOOR_COLOR;
        ctx.fillRect(i, y + height, 1, SCREEN_HEIGHT / 2 + height / 2);

        // Wall
        if (!RENDER_SPRITES || !ray.sprite) {
            ctx.fillStyle = ray.color;
            ctx.fillRect(i, y, 1, height);
        } else {
            ctx.drawImage(spritesImage, ray.sprite.x + ray.spriteX, ray.sprite.y, 1, SPRITE_SIZE, i, y, 1, height);
        }
    }
}

function drawObjects(rays, objects) {

    objects.forEach(object => {

        const distance = Vector.distance(player.x, player.y, object.x, object.y);

        if (distance < .5) {
            return;
        }

        const angle = fixAngle(Math.atan2(object.y - player.y, object.x - player.x));
        const height = WALL_HEIGHT / distance * 277;
        const x = Math.floor(SCREEN_WIDTH / 2 - (player.angle - angle) * SCREEN_WIDTH / FOV - height / 2);

        for (let i = 0; i < height; i++) {
            if (x + i >= 0 && x + i < rays.length && rays[x + i].distance > distance) {
                ctx.drawImage(spritesImage, object.sprite.x + Math.floor(SPRITE_SIZE / height * i), object.sprite.y, 1, SPRITE_SIZE, x + i, SCREEN_HEIGHT / 2 - height / 2, 1, height);
            }
        }
    });
}

function drawMiniMap(map, rays, largeMap) {

    const scale = Math.floor(SCREEN_HEIGHT / MAP.length / 2);
    const width = map[0].length * scale;
    const height = map.length * scale;
    const left = Math.floor(SCREEN_WIDTH / 2 - width / 2);
    const top = Math.floor(SCREEN_HEIGHT / 2 - height / 2);
    const position = new Vector(player.x, player.y).multiply(scale).add(left, top);
    const radius = scale * MINIMAP_CELLRADIUS;
    const translate = new Vector(0, 0).subtract(position).add(radius).add(scale, SCREEN_HEIGHT - radius * 2 - scale);


    if (!largeMap) {
        // Translate and clip to a circle
        ctx.save();
        ctx.translate(translate.x, translate.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, DOUBLE_PI);
        ctx.stroke();
        ctx.clip();
    }

    // Set alpha
    ctx.globalAlpha = MINIMAP_ALPHA;

    // Floors
    ctx.fillStyle = '#bbb';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Walls
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {

            const colorIndex = map[y][x];

            if (colorIndex === 0) {
                continue;
            }

            ctx.fillStyle = MAP_LEGEND[colorIndex].color;
            ctx.fillRect(left + x * scale, top + y * scale, scale, scale);
        }

    }

    // Doors
    for (let y = 0; y < DOOR_MAP.length; y++) {
        for (let x = 0; x < DOOR_MAP[0].length; x++) {

            const colorIndex = DOOR_MAP[y][x];
            if (colorIndex === 0) {
                continue;
            }

            const door = DOOR_MAP_LEGEND[colorIndex];

            ctx.fillStyle = door.color;

            if (door.inset) {
                if (map[y - 1][x]) {
                    // Vertical door
                    ctx.fillRect(left + x * scale + scale / 3, top + y * scale, scale / 3, scale);
                } else {
                    ctx.fillRect(left + x * scale, top + y * scale + scale / 3, scale, scale / 3);
                }
            } else {
                ctx.fillRect(left + x * scale, top + y * scale, scale, scale);
            }
        }

    }

    // Rays
    if (MINIMAP_RAYS) {
        ctx.globalAlpha = .025
        ctx.strokeStyle = 'rgb(255, 255, 0)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        rays.forEach(ray => {
            const destination = new Vector(Math.cos(ray.angle), Math.sin(ray.angle)).multiply(ray.distance).multiply(scale).add(position);
            ctx.moveTo(position.x, position.y);
            ctx.lineTo(destination.x, destination.y);
        });
        ctx.stroke();
        ctx.globalAlpha = MINIMAP_ALPHA;
    }

    // Torso
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(position.x, position.y, scale / 2, scale / 3, player.angle + HALF_PI, 0, DOUBLE_PI)
    ctx.fill();

    // Direction
    const destination = new Vector(Math.cos(player.angle), Math.sin(player.angle)).multiply(scale).add(position);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(destination.x, destination.y);
    ctx.stroke();

    // Head
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(position.x, position.y, scale / 4, 0, DOUBLE_PI);
    ctx.fill();

    ctx.globalAlpha = 1;

    if (!largeMap) {
        ctx.restore();
    }
}

function drawFps(fps) {
    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;
    ctx.textBaseline = 'top'

    const display = `${fps} FPS`;
    const size = ctx.measureText(display);
    ctx.fillText(display, SCREEN_WIDTH - (size.width + 5), 5);
}

function drawCoordinates() {

    const positionText = `${player.x.toFixed(0)}, ${player.y.toFixed(0)}`;
    const positionTextMeasurement = ctx.measureText(positionText);

    ctx.font = '10px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,.75)'
    ctx.fillRect(0, SCREEN_HEIGHT - 20, positionTextMeasurement.width + 10, 20);
    ctx.fillStyle = 'white';
    ctx.fillText(positionText, 5, SCREEN_HEIGHT - 10);
}

function drawStatusText(text) {
    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;
    ctx.textBaseline = 'top'

    ctx.fillText(text, 5, 5);
}

spritesImage.onload = () => {
    // Remove the loader to prevent looping behaviour.
    spritesImage.onload = null;

    // The sprite image doesn't contain opacity data, 
    // so we need to turn all pink colors to 0 alpha.

    // Create a temporary canvas.
    const canvas = document.createElement('canvas');
    canvas.width = spritesImage.width;
    canvas.height = spritesImage.height;

    // Get the context and draw the sprite onto it.
    const ctx = canvas.getContext('2d');
    ctx.drawImage(spritesImage, 0, 0);

    // Get the image data.
    const imageData = ctx.getImageData(0, 0, spritesImage.width, spritesImage.height);
    const data = imageData.data;

    // Convert rgba(152, 0, 136, 255) to transparent.
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 152 && data[i + 1] === 0 & data[i + 2] === 136) {
            data[i + 3] = 0;
        }
    }

    // Place the modifed image data onto the canvas.
    ctx.putImageData(imageData, 0, 0);
    spritesImage.src = canvas.toDataURL();

    // Remove the temporary canvas
    canvas.remove();

    startGame();
};