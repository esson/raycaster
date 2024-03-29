import './styles.css';
import Vector from './vector';
import level_1_1 from './level-1-1'
import fps from './fps'
import PerformanceCounter from './performance-counter';
import { getSpritesheetCoordinates } from './sprites';

// Constants
//

const PI = Math.PI;
const DOUBLE_PI = PI * 2;
const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;
const DEG_TO_PI = PI / 180;

const SCREEN_SCALE = 2.25;
const SCREEN_WIDTH = 640 * SCREEN_SCALE;
const SCREEN_HEIGHT = 480 * SCREEN_SCALE;
const SCREEN_SAFEZONE = 10;

const GAME_WIDTH = 320;
const GAME_HEIGHT = 210;

const SCREEN_BACKGROUND = '#004241';

const FOV_DEG = 75;
const FOV = FOV_DEG * DEG_TO_PI;
const WALL_HEIGHT_RATIO = GAME_WIDTH / GAME_HEIGHT / FOV_DEG * 51;
const SPRITE_SIZE = 64;

const OSD_BACKGORUND = '#00000033';
const OSD_COLOR = '#fff';
const OSD_FONT = '12px monospace';
const OSD_HEIGHT = 20;
const OSD_MIDDLE = OSD_HEIGHT / 2;

const PLAYER_SIZE = 1 / 3;

const MOVE_SLOW = .04;
const MOVE_NORMAL = .06;
const MOVE_FAST = .10;

const TURN_RADIUS = DEG_TO_PI * 1.5;

const DIRECTION_NORTH = 0;
const DIRECTION_SOUTH = 1;
const DIRECTION_EAST = 2;
const DIRECTION_WEST = 3;

const DOOR_OPEN = 1;
const DOOR_CLOSED = 2;
const DOOR_OPENING = 3;
const DOOR_CLOSING = 4;

const DOOR_OPEN_TICKS = 2000;

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

const WEAPONS = [{
    isFiring: false,
    position: 0,
    sprite: [522, 523, 524, 525, 526].map(x => getSpritesheetCoordinates(x)),
}, {
    isFiring: false,
    position: 0,
    sprite: [527, 528, 529, 530, 531].map(x => getSpritesheetCoordinates(x)),
}, {
    isFiring: false,
    position: 0,
    sprite: [532, 533, 534, 535, 536].map(x => getSpritesheetCoordinates(x)),
}, {
    isFiring: false,
    position: 0,
    sprite: [537, 538, 539, 540, 541].map(x => getSpritesheetCoordinates(x)),
}]

const PLAYER_DEFAULT = {
    angle: 0,
    speed: 0,
    side: 0,
    weapon: WEAPONS[0]
};

// Settings
//

let SHOW_DEBUG = JSON.parse(localStorage.getItem('SHOW_FPS')) ?? true;
let SHOW_GRAPHS = JSON.parse(localStorage.getItem('SHOW_GRAPHS')) ?? true;
let RENDER_SPRITES = JSON.parse(localStorage.getItem('RENDER_SPRITES')) ?? true;
let RENDER_INTERLACED = JSON.parse(localStorage.getItem('RENDER_INTERLACED')) ?? true;
let WALL_COLLISION = JSON.parse(localStorage.getItem('WALL_COLLISION')) ?? true;
let GAME_DISPLAY = JSON.parse(localStorage.getItem('GAME_DISPLAY')) ?? 1;

// State Save
//

window.addEventListener('unload', (e) => {

    localStorage.setItem('player', JSON.stringify(player));

    localStorage.setItem('SHOW_DEBUG', JSON.stringify(SHOW_DEBUG));
    localStorage.setItem('SHOW_GRAPHS', JSON.stringify(SHOW_GRAPHS));

    localStorage.setItem('RENDER_INTERLACED', JSON.stringify(RENDER_INTERLACED));
    localStorage.setItem('RENDER_SPRITES', JSON.stringify(RENDER_SPRITES));

    localStorage.setItem('GAME_DISPLAY', JSON.stringify(GAME_DISPLAY));
});

// Level / Map / Doors / Objects
//

const LEVEL = level_1_1;

const WALLS = LEVEL.walls;
const PUSHWALLS = LEVEL.pushWalls;
const DOORS = LEVEL.doors;
const OBJECTS = LEVEL.objects;

const VISIBILITY = WALLS.map(row => row.map(col => 0));

// Spritesheet
//

const spritesheet = new Image();
spritesheet.src = LEVEL.spriteUrl;
// Start the game once the image has loaded.
spritesheet.onload = () => startGame();

// Canvas
//

/**
 * @type HTMLCanvasElement
 */
var canvas = document.getElementById('canvas');
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Messages
//

let messageText = null;
let messageTextTimeoutId;

function setMessageText(messageOrSettingName, settingValue) {

    if (typeof settingValue === 'undefined') {
        messageText = messageOrSettingName;
    } else {
        messageText = `${messageOrSettingName} ${settingValue ? 'ON' : 'OFF'}`;
    }

    if (messageTextTimeoutId) {
        clearTimeout(messageTextTimeoutId);
    }

    messageTextTimeoutId = setTimeout(() => messageText = null, 1500);
}

// Keyboard
//

const controls = {
    up: false,
    down: false,
    left: false,
    right: false,
    turbo: false,
    stealth: false,
    strafe: false,
    fire: false,
    map: MINIMAP_SMALL,
    action: false,
    pause: false
};

const keyboardToControlMap = {
    KeyW: 'up',
    KeyA: 'left',
    KeyS: 'down',
    KeyD: 'right',
    KeyZ: 'strafe',
    KeyX: 'fire',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ShiftLeft: 'turbo',
    Space: 'action'
};

const keyboardToControlToggleMap = {
    Escape: 'pause'
};

const keyboardToFunctionMap = {
    // Toggle Weapon 1
    Digit1: () => player.weapon = WEAPONS[0],
    Digit2: () => player.weapon = WEAPONS[1],
    Digit3: () => player.weapon = WEAPONS[2],
    Digit4: () => player.weapon = WEAPONS[3],
    Digit5: () => player.weapon = null,
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
                controls.map = MINIMAP_SMALL; // Never toggle to NONE for now
                break;
        }
    },
    // Toggle Debug
    KeyU: () => SHOW_DEBUG = !SHOW_DEBUG,
    // Toggle Performance Graphs
    KeyG: () => SHOW_GRAPHS = !SHOW_GRAPHS,
    // Toggle Interlacing
    KeyI: () => setMessageText('INTERLACING', RENDER_INTERLACED = !RENDER_INTERLACED),
    // Toggle Sprites
    KeyO: () => setMessageText('SPRITES', RENDER_SPRITES = !RENDER_SPRITES),
    // Toggle Wall Collision
    BracketLeft: () => setMessageText('WALL COLLISION', WALL_COLLISION = !WALL_COLLISION),
    // Toggle Smoothing
    KeyP: () => setMessageText('SMOOTHING', ctx.imageSmoothingEnabled = !ctx.imageSmoothingEnabled),
    // Reset
    KeyR: () => (setMessageText('PLAYER RESET'), player = { ...PLAYER_DEFAULT, x: LEVEL.spawn.x, y: LEVEL.spawn.y }, floodFillMinimap(Math.floor(player.x), Math.floor(player.y))),
    // Zoom In
    NumpadAdd: () => GAME_DISPLAY = Math.min(GAME_DISPLAY + 1, 3),
    // Zoom Out
    NumpadSubtract: () => GAME_DISPLAY = Math.max(GAME_DISPLAY - 1, 1)
}

document.addEventListener('keydown', (e) => {

    // Set false on controls
    if (e.code in keyboardToControlMap) {
        controls[keyboardToControlMap[e.code]] = true;
    }
});

document.addEventListener('keyup', (e) => {

    console.log(e.code);

    // Set false on controls
    if (e.code in keyboardToControlMap) {
        controls[keyboardToControlMap[e.code]] = false;
    }

    // Toggle boolean on controls
    if (e.code in keyboardToControlToggleMap) {
        controls[keyboardToControlToggleMap[e.code]] = !controls[keyboardToControlToggleMap[e.code]];
    }

    // Trigger function
    if (e.code in keyboardToFunctionMap) {
        keyboardToFunctionMap[e.code]();
    }
});

// Player
//
let player = JSON.parse(localStorage.getItem('player')) ?? { ...PLAYER_DEFAULT, x: LEVEL.spawn.x, y: LEVEL.spawn.y };

// Game Loop
//

function startGame() {

    // If player is in door way, make door open.
    const mapY = Math.floor(player.y),
        mapX = Math.floor(player.x);

    const door = DOORS[mapY][mapX];

    if (door) {
        door.action = DOOR_OPEN;
        door.position = 1;
    }

    // Fill the minimap
    floodFillMinimap(mapX, mapY);

    // Start the game loop
    requestAnimationFrame(loop);
}

/**
 * Increases on each frame, used to render with interlaced vertical lines.
 */
let frameCounter = 0;
let lastPerf = performance.now();

const calcPerf = new PerformanceCounter('Calculations');
const drawPerf = new PerformanceCounter('Drawing');

function loop() {

    const now = performance.now();
    const delta = now - lastPerf;

    lastPerf = now;
    frameCounter++;

    try {

        if (!controls.pause) {

            const gx = SCREEN_WIDTH / 2 - GAME_WIDTH * GAME_DISPLAY / 2;
            const gy = (SCREEN_HEIGHT - 200) / 2 - GAME_HEIGHT * GAME_DISPLAY / 2;
            const gw = GAME_WIDTH * GAME_DISPLAY;
            const gh = GAME_HEIGHT * GAME_DISPLAY;

            let rays;

            // Calculations
            // ------------------------------
            calcPerf.start();

            update(delta);
            rays = getRays(player, gw);

            calcPerf.stop();

            // Render
            // ------------------------------
            drawPerf.start();

            render(rays.rays, rays.visibleCells, gx, gy, gw, gh);

            drawPerf.stop();

            // Render Performance Chart
            // ------------------------------
            if (SHOW_GRAPHS) {
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
    moveDoors(delta);
    movePushWalls(delta);
}

function render(rays, visibleCells, x, y, w, h) {

    // Because interlaced rendering of game requires that we don't clear,
    // we clear and fill around the game rect.

    ctx.fillStyle = SCREEN_BACKGROUND;

    if (RENDER_INTERLACED || frameCounter > 0) {
        clearAround(ctx, x, y, w, h);
        fillRectAround(ctx, x, y, w, h);
    } else {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, w, h);
    }

    // Draw game border
    drawInset(ctx, x, y, w, h, 2, '#05716e', '#000000');

    // Add clipping to prevent the game from rendering outside it's 
    // display area.

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    // Render the game screen.
    renderScene(ctx, rays, x, y, w, h);
    renderObjects(ctx, rays, visibleCells, OBJECTS, x, y, w, h);
    renderPlayer(ctx, player, x, y, w, h);

    // Restore to stop clipping.
    ctx.restore();

    if (controls.map > MINIMAP_NONE) {
        renderMap(ctx, WALLS, rays, controls.map === MINIMAP_LARGE);
    }

    if (SHOW_DEBUG || messageText) {

        renderOsd(ctx);

        if (SHOW_DEBUG) {
            renderCoordinates(ctx);
            renderFps(ctx, fps.tick());
        }

        if (messageText) {
            renderMessage(ctx, messageText);
        }
    }
}

function floodFillMinimap(x, y) {

    if (y < 0 || y >= WALLS.length || x < 0 || x >= WALLS[y].length) {
        return;
    }

    if (VISIBILITY[y][x] > 0) {
        return;
    }

    VISIBILITY[y][x] = 1;

    // Stop at walls/doors/push walls
    if (WALLS[y][x] || DOORS[y][x] || PUSHWALLS[y][x]) {

        // Fill Wall Corners

        // Top Right
        if (WALLS[y][x] && !isOutOfBounds(x + 1, y + 1, WALLS[0].length, WALLS.length) && WALLS[y + 1][x + 1] && WALLS[y][x + 1]) VISIBILITY[y][x + 1] = 1;
        // Right Top
        if (WALLS[y][x] && !isOutOfBounds(x - 1, y - 1, WALLS[0].length, WALLS.length) && WALLS[y - 1][x - 1] && WALLS[y - 1][x]) VISIBILITY[y - 1][x] = 1;
        // Right Bottom
        if (WALLS[y][x] && !isOutOfBounds(x - 1, y + 1, WALLS[0].length, WALLS.length) && WALLS[y + 1][x - 1] && WALLS[y + 1][x]) VISIBILITY[y + 1][x] = 1;
        // Bottom Right
        if (WALLS[y][x] && !isOutOfBounds(x + 1, y - 1, WALLS[0].length, WALLS.length) && WALLS[y - 1][x + 1] && WALLS[y][x + 1]) VISIBILITY[y][x + 1] = 1;
        // Bottom Left
        if (WALLS[y][x] && !isOutOfBounds(x - 1, y - 1, WALLS[0].length, WALLS.length) && WALLS[y - 1][x - 1] && WALLS[y][x - 1]) VISIBILITY[y][x - 1] = 1;
        // Left Top
        if (WALLS[y][x] && !isOutOfBounds(x + 1, y - 1, WALLS[0].length, WALLS.length) && WALLS[y - 1][x + 1] && WALLS[y - 1][x]) VISIBILITY[y - 1][x] = 1;
        // Top Left
        if (WALLS[y][x] && !isOutOfBounds(x - 1, y + 1, WALLS[0].length, WALLS.length) && WALLS[y + 1][x - 1] && WALLS[y][x - 1]) VISIBILITY[y][x - 1] = 1;

        return;
    }

    floodFillMinimap(x - 1, y);
    floodFillMinimap(x + 1, y);
    floodFillMinimap(x, y - 1);
    floodFillMinimap(x, y + 1);
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


function getDirection(angle) {
    angle = angle + QUARTER_PI;

    while (angle < 0) {
        angle += DOUBLE_PI;
    }

    while (angle > DOUBLE_PI) {
        angle -= DOUBLE_PI;
    }

    if (angle > 3 * HALF_PI) {
        return DIRECTION_NORTH;
    } else if (angle > PI) {
        return DIRECTION_WEST;
    } else if (angle > HALF_PI) {
        return DIRECTION_SOUTH;
    } else {
        return DIRECTION_EAST;
    }
}

/**
 * Corrects the provided distance to compensate for fish-eye effect.
 * @param {number} distance The ray distance.
 * @param {number} viewAngle The ray angle.
 * @param {number} playerAngle The player angle.
 */
function getViewCorrectedDistance(distance, viewAngle, playerAngle) {

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
    let pushWall;
    let door;

    let nextX = mapX;
    let nextY = mapY;

    let color;
    let sprite;
    let spriteOffsetX = 0;

    const cells = [];

    while (true) {

        const cellX = Math.floor(nextX);
        const cellY = up ? Math.floor(nextY) - 1 : Math.floor(nextY);

        if (isOutOfBounds(cellX, cellY, WALLS[0].length, WALLS.length)) {
            break;
        }

        wall = WALLS[cellY][cellX];

        if (wall) {
            // If cell is adjacent to door, we render door frame
            let adjacentDoor = up ? DOORS[cellY + 1][cellX] : DOORS[cellY - 1][cellX];

            if (adjacentDoor) {
                color = adjacentDoor.frameColor;
                sprite = adjacentDoor.frameSprite;
            } else {
                color = wall.color;
                sprite = wall.sprite;
            }

            break;
        }

        pushWall = PUSHWALLS[cellY][cellX];

        if (pushWall) {

            const pushWallY = Math.abs(stepY) * pushWall.position * pushWall.dirY;
            const pushWallX = pushWallY / Math.tan(angle);

            if (pushWall.action === 0 || Math.floor(nextX + pushWallX) === cellX) {
                color = pushWall.color;
                sprite = pushWall.sprite;

                nextX += pushWallX;
                nextY += pushWallY;

                break;
            }
        }

        door = DOORS[cellY][cellX];

        // Special logic for the doors, they are inset by half step and can be opening/closing.
        if (door && door.action !== DOOR_OPEN) {

            // If door is opening or closing, we check if we hit it.
            if (door.action === DOOR_CLOSED || nextX + halfStepX - Math.floor(nextX + halfStepX) > door.position) {

                color = door.color;
                sprite = door.sprite;
                spriteOffsetX = -door.position;

                nextX += halfStepX;
                nextY += halfStepY;

                break;
            }
        }

        cells.push([cellX, cellY]);

        nextX += stepX;
        nextY += stepY;
    }

    return {
        angle,
        distance: Vector.distance(player.x, player.y, nextX, nextY),
        color: color,
        sprite: sprite,
        spriteX: up || door ? (spriteOffsetX + nextX - Math.floor(nextX)) * SPRITE_SIZE : (1 - spriteOffsetX + Math.floor(nextX) - nextX) * SPRITE_SIZE,
        vertical: false,
        cells: cells
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
    let pushWall;
    let door;

    let nextX = mapX;
    let nextY = mapY;

    let color;
    let sprite;
    let spriteOffsetX = 0;

    const cells = [];

    while (true) {

        const cellX = right ? Math.floor(nextX) : Math.floor(nextX) - 1;;
        const cellY = Math.floor(nextY);

        if (isOutOfBounds(cellX, cellY, WALLS[0].length, WALLS.length)) {
            break;
        }

        wall = WALLS[cellY][cellX];

        if (wall) {
            // If cell is adjacent to door, we render door frame
            let adjacentDoor = right ? DOORS[cellY][cellX - 1] : DOORS[cellY][cellX + 1];

            if (adjacentDoor) {
                color = adjacentDoor.frameDarkColor;
                sprite = adjacentDoor.frameDarkSprite;
            } else {
                color = wall.darkColor;
                sprite = wall.darkSprite;
            }

            break;
        }

        pushWall = PUSHWALLS[cellY][cellX];

        if (pushWall) {

            const pushWallX = Math.abs(stepX) * pushWall.position * pushWall.dirX;
            const pushWallY = pushWallX * Math.tan(angle);

            if (pushWall.action === 0 || Math.floor(nextY + pushWallY) === cellY) {
                color = pushWall.darkColor;
                sprite = pushWall.darkSprite;

                nextX += pushWallX;
                nextY += pushWallY;

                break;
            }
        }

        door = DOORS[cellY][cellX];

        // Special logic for the doors, they are inset by half step and can be opening/closing.
        if (door && door.action !== DOOR_OPEN) {

            // If door is opening or closing, we check if we hit it.
            if (door.action === DOOR_CLOSED || nextY + halfStepY - Math.floor(nextY + halfStepY) > door.position) {

                color = door.darkColor;
                sprite = door.darkSprite;
                spriteOffsetX = -door.position;

                nextX += halfStepX;
                nextY += halfStepY;

                break;
            }
        }

        cells.push([cellX, cellY]);

        nextX += stepX;
        nextY += stepY;
    }

    return {
        angle,
        distance: Vector.distance(player.x, player.y, nextX, nextY),
        color: color,
        sprite: sprite,
        spriteX: right || door ? (spriteOffsetX + nextY - Math.floor(nextY)) * SPRITE_SIZE : (1 - spriteOffsetX + Math.floor(nextY) - nextY) * SPRITE_SIZE,
        vertical: true,
        cells: cells
    };
}

function getRays(player, w) {

    const start = player.angle - FOV / 2;
    const step = FOV / w;
    const rays = [];
    const visibleCells = [];

    for (let y = 0; y < WALLS.length; y++) {
        visibleCells[y] = [];
        for (let x = 0; x < WALLS[y].length; x++) {
            visibleCells[y][x] = 0;
        }
    }

    for (let i = 0; i < w; i++) {

        const angle = start + step * i;
        const hCollision = getHorizontalCollision(angle, player);
        const vCollision = getVerticalCollision(angle, player);

        const collision = hCollision.distance > vCollision.distance ? vCollision : hCollision;

        collision.cells.forEach(([x, y]) => {
            visibleCells[y][x] = true;
        });

        rays.push(collision);
    }

    return {
        rays,
        visibleCells
    };
}

function movePlayer(delta) {

    // At 100 fps, delta is 10.
    const timeScale = delta / 1000 * 100;

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
    } else {
        player.side = 0;
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

    // Fire Weapon

    if (controls.fire && player.weapon?.isFiring === false) {
        player.weapon.isFiring = true;
        player.weapon.position = 0;
    }

    // Action / Open Doors

    if (controls.action) {

        let actionX = Math.floor(player.x + Math.cos(player.angle));
        let actionY = Math.floor(player.y + Math.sin(player.angle));

        // Check if there's a door to action
        let door = DOORS[actionY][actionX];

        if (door) {
            switch (door.action) {
                case DOOR_CLOSED:
                case DOOR_CLOSING:
                    door.action = DOOR_OPENING;
                    break;
                case DOOR_OPEN:
                case DOOR_OPENING:
                    door.action = DOOR_CLOSING;
                    break;
            }
        }

        // Check if there's a push wall to action
        let pushWall = PUSHWALLS[actionY][actionX];

        if (pushWall && pushWall.action === 0) {
            const direction = getDirection(player.angle);
            let dy = 0, dx = 0;

            switch (direction) {
                case DIRECTION_NORTH:
                    dy = -1;
                    break;
                case DIRECTION_SOUTH:
                    dy = 1;
                    break;
                case DIRECTION_EAST:
                    dx = 1;
                    break;
                case DIRECTION_WEST:
                    dx = -1;
                    break;
            }

            // Check for things blocking
            if (!WALLS[actionY + dy][actionX + dx]) {
                pushWall.dirX = dx;
                pushWall.dirY = dy;
                pushWall.position = 0;
                pushWall.action = 1;
            }
        }

        // Check if there's a wall to action
        let wall = WALLS[actionY][actionX];

        if (wall && wall.next) {
            WALLS[actionY][actionX] = wall.next;
        }

        controls.action = false;
    }

    // Fire Weapon

    if (player.weapon?.isFiring) {
        player.weapon.position += delta / 400;

        if (player.weapon.position >= 1) {
            player.weapon.isFiring = false;
            player.weapon.position = 0;
        }
    }

    // Move the Player

    let moveX = 0;
    let moveY = 0;

    if (player.speed !== 0) {
        moveX += Math.cos(player.angle) * player.speed;
        moveY += Math.sin(player.angle) * player.speed;
    }

    if (player.side !== 0) {
        moveX += Math.sin(player.angle) * player.side;
        moveY -= Math.cos(player.angle) * player.side;
    }

    if (moveX === 0 && moveY === 0) {
        return;
    }

    if (tryMovePlayer(player.x + moveX, player.y + moveY)) {
        player.x += moveX;
        player.y += moveY;
        return;
    }

    if (moveX && tryMovePlayer(player.x + moveX, player.y)) {
        player.x += moveX;
        return;
    }

    if (moveY && tryMovePlayer(player.x, player.y + moveY)) {
        player.y += moveY;
        return;
    }
}

function moveDoors(delta) {

    for (let y = 0; y < DOORS.length; y++) {
        for (let x = 0; x < DOORS[y].length; x++) {

            const door = DOORS[y][x];

            if (!door) {
                continue;
            }

            switch (door.action) {
                case DOOR_OPEN:
                    if (Math.floor(player.x) === x && Math.floor(player.y) === y) {
                        door.ticks = 0;
                    } else {
                        door.ticks += delta;
                    }

                    if (door.ticks >= DOOR_OPEN_TICKS) {
                        door.action = DOOR_CLOSING;
                    }

                    break;
                case DOOR_OPENING:
                    door.position += delta / 1000;

                    if (door.position >= 1) {
                        door.position = 1;
                        door.ticks = 0;
                        door.action = DOOR_OPEN;

                        const dirY = y - Math.floor(player.y);
                        const dirX = x - Math.floor(player.x);
                        floodFillMinimap(x + dirX, y + dirY);
                    }

                    break;
                case DOOR_CLOSING:
                    door.position -= delta / 1000;

                    if (door.position <= 0) {
                        door.position = 0;
                        door.action = DOOR_CLOSED;
                    }

                    break;
            }

        }
    }
}

function movePushWalls(delta) {

    for (let y = 0; y < PUSHWALLS.length; y++) {
        for (let x = 0; x < PUSHWALLS[y].length; x++) {

            const pushWall = PUSHWALLS[y][x];

            if (!pushWall || !pushWall.action) {
                continue;
            }

            if (pushWall.action > 0) {
                pushWall.position += delta / 1000;

                if (pushWall.position >= 1) {
                    pushWall.action = 0;
                    pushWall.position = 0;

                    // Move the wall on the map
                    PUSHWALLS[y][x] = undefined;
                    PUSHWALLS[y + pushWall.dirY][x + pushWall.dirX] = pushWall;

                    // If the next tile isn't a wall, we'll continue moving the push wall.
                    if (!WALLS[y + pushWall.dirY * 2][x + pushWall.dirX * 2] && !PUSHWALLS[y + pushWall.dirY * 2][x + pushWall.dirX * 2]) {
                        pushWall.action = 1;
                    } else {
                        floodFillMinimap(x, y);
                    }
                }
            }
        }
    }
}

function tryMovePlayer(x, y) {

    if (!WALL_COLLISION) {
        return true;
    }

    var xl = Math.floor(x - PLAYER_SIZE);
    var yl = Math.floor(y - PLAYER_SIZE);
    var xh = Math.floor(x + PLAYER_SIZE);
    var yh = Math.floor(y + PLAYER_SIZE);

    for (let dy = yl; dy <= yh; dy++) {
        for (let dx = xl; dx <= xh; dx++) {
            if (WALLS[dy][dx]) {
                return false;
            }
            if (PUSHWALLS[dy][dx]) {
                return false;
            }
            if (DOORS[dy][dx] && DOORS[dy][dx].action !== DOOR_OPEN) {
                return false;
            }
            if (OBJECTS[dy][dx] && OBJECTS[dy][dx].solid) {
                return false;
            }
        }
    }

    return true;
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {*} rays 
 * @param {*} dx 
 * @param {*} dy 
 * @param {*} dw 
 * @param {*} dh 
 */
function renderScene(ctx, rays, dx, dy, dw, dh) {

    let x = RENDER_INTERLACED && frameCounter % 2 === 0 ? 1 : 0;
    let increment = RENDER_INTERLACED ? 2 : 1;

    for (; x < rays.length; x += increment) {

        const ray = rays[x];

        const distance = getViewCorrectedDistance(ray.distance, ray.angle, player.angle);
        const height = dh / distance * WALL_HEIGHT_RATIO;
        const y = dh / 2 - height / 2;

        // Ceiling
        ctx.fillStyle = LEVEL.ceiling;
        ctx.fillRect(dx + x, dy + 0, 1, y);

        // Floor
        ctx.fillStyle = LEVEL.floor;
        ctx.fillRect(dx + x, dy + y + height, 1, y);

        // Wall
        if (!RENDER_SPRITES || !ray.sprite) {
            ctx.fillStyle = ray.color ?? '#000';
            ctx.fillRect(dx + x, dy + y, 1, height);
        } else {
            ctx.drawImage(spritesheet, ray.sprite.x + ray.spriteX, ray.sprite.y, 1, SPRITE_SIZE, dx + x, dy + y, 1, height);
        }
    }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {*} rays 
 * @param {*} objects 
 * @param {*} dx 
 * @param {*} dy 
 * @param {*} dw 
 * @param {*} dh 
 * @returns 
 */
function renderObjects(ctx, rays, visibleCells, objects, dx, dy, dw, dh) {

    let visibleObjects = objects.flatMap((row, y) => row.filter((obj, x) => obj && visibleCells[y][x]));

    // Sort the objects by distance, furthest to nearest.
    visibleObjects = visibleObjects.map(obj => [Vector.distance(player.x, player.y, obj.x, obj.y), obj]).sort((a, b) => b[0] - a[0]).map(x => x[1]);

    for (let i = 0; i < visibleObjects.length; i++) {

        const object = visibleObjects[i];

        if (!object) {
            continue;
        }

        // Calculate where the sprite is to be rendered in 3D space
        const angle = fixAngle(player.angle - Math.atan2(object.y - player.y, object.x - player.x));
        const spriteDistance = Vector.distance(player.x, player.y, object.x, object.y);
        const distance = getViewCorrectedDistance(spriteDistance, player.angle + angle, player.angle);
        const size = dh / distance * WALL_HEIGHT_RATIO;
        const x = Math.floor(dw / 2 - size / 2 - angle * dw / FOV);

        // The left or right may be blocked by walls, so we need to find an x offset and a width of what is to be actually drawn.
        let slice = null;

        for (let j = 0; j < size; j++) {
            if (x + j >= 0 && x + j < rays.length && rays[x + j].distance > distance) {
                if (!slice) {
                    slice = {
                        sx: object.sprite.x + Math.floor(SPRITE_SIZE / size * j),
                        dx: dx + x + j,
                        w: 0
                    };
                }
                slice.w++;
            } else if (slice) {
                break;
            }
        }

        if (slice) {
            // Draw the sprite.
            ctx.drawImage(spritesheet,
                slice.sx, object.sprite.y, Math.floor(64 / size * slice.w), SPRITE_SIZE,
                slice.dx, dy + dh / 2 - size / 2, slice.w, size)
        }

    }
}

function renderPlayer(ctx, player, dx, dy, dw, dh) {
    
    if (!player.weapon) {
        return;
    }

    const spriteIndex = Math.floor(player.weapon.sprite.length * player.weapon.position);
    const sprite = player.weapon.sprite[spriteIndex];

    ctx.drawImage(spritesheet, sprite.x, sprite.y, SPRITE_SIZE, SPRITE_SIZE, dx + (dw - dh) / 2, dy, dh, dh);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {*} map 
 * @param {*} rays 
 * @param {*} largeMap 
 */
function renderMap(ctx, map, rays, largeMap) {

    const scale = Math.floor(SCREEN_HEIGHT / WALLS.length / 2);
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

    // Set globalAlpha
    ctx.globalAlpha = MINIMAP_ALPHA;

    // Floors
    ctx.fillStyle = '#bbb';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Walls / Push Walls
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {

            if (VISIBILITY[y][x] === 0) {
                continue;
            }

            const wall = map[y][x];
            const pushWall = PUSHWALLS[y][x];

            if (wall) {
                ctx.fillStyle = wall.color;
                ctx.fillRect(left + x * scale, top + y * scale, scale, scale);
            }

            if (pushWall) {
                ctx.fillStyle = pushWall.color;
                ctx.fillRect(left + (x + pushWall.position * pushWall.dirX) * scale, top + (y + pushWall.position * pushWall.dirY) * scale, scale, scale);
            }
        }
    }

    // Doors
    for (let y = 0; y < DOORS.length; y++) {
        for (let x = 0; x < DOORS[0].length; x++) {

            const door = DOORS[y][x];

            if (!door || VISIBILITY[y][x] === 0) {
                continue;
            }

            ctx.fillStyle = door.color;

            if (map[y - 1][x]) {
                // Vertical door
                ctx.fillRect(left + x * scale + scale / 3, top + (y + door.position) * scale, scale / 3, scale * (1 - door.position));
            } else {
                // Horizontal door
                ctx.fillRect(left + (x + door.position) * scale, top + y * scale + scale / 3, scale * (1 - door.position), scale / 3);
            }
        }

    }

    // Rays
    if (MINIMAP_RAYS) {

        ctx.globalAlpha = .025;

        ctx.strokeStyle = 'rgb(255, 255, 0)';
        ctx.lineWidth = 1;

        ctx.beginPath();

        for (let i = 0; i < rays.length; i++) {

            const ray = rays[i];
            const destination = new Vector(Math.cos(ray.angle), Math.sin(ray.angle)).multiply(ray.distance).multiply(scale).add(position);

            ctx.moveTo(position.x, position.y);
            ctx.lineTo(destination.x, destination.y);
        }

        ctx.stroke();

        ctx.globalAlpha = MINIMAP_ALPHA;
    }

    // Torso
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(position.x, position.y, PLAYER_SIZE * scale * 2, PLAYER_SIZE * scale / 3 * 2, player.angle + HALF_PI, 0, DOUBLE_PI)
    ctx.fill();

    // Direction
    const destination = new Vector(Math.cos(player.angle), Math.sin(player.angle)).multiply(PLAYER_SIZE * scale * 2).add(position);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(destination.x, destination.y);
    ctx.stroke();

    // Head
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(position.x, position.y, PLAYER_SIZE * scale / 4 * 2, 0, DOUBLE_PI);
    ctx.fill();

    // Reset globalAlpha
    ctx.globalAlpha = 1;

    // Restore the context
    if (!largeMap) {
        ctx.restore();
    }
}

function renderOsd(ctx) {

    ctx.fillStyle = OSD_BACKGORUND;
    ctx.fillRect(SCREEN_SAFEZONE, SCREEN_SAFEZONE, SCREEN_WIDTH - SCREEN_SAFEZONE * 2, OSD_HEIGHT);
}

function renderFps(ctx, fps) {

    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    ctx.fillText(`${fps} FPS`, SCREEN_WIDTH - SCREEN_SAFEZONE * 2, SCREEN_SAFEZONE + OSD_MIDDLE);
}

function renderCoordinates(ctx) {

    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.fillText(`${player.x.toFixed(0)},${player.y.toFixed(0)} ${(player.angle).toFixed(2)}`, SCREEN_SAFEZONE * 2, SCREEN_SAFEZONE + OSD_MIDDLE);
}

function renderMessage(ctx, text) {

    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, SCREEN_WIDTH / 2, SCREEN_SAFEZONE + OSD_MIDDLE);
}

function clearAround(ctx, x, y, w, h) {

    ctx.clearRect(0, 0, SCREEN_WIDTH, y);
    ctx.clearRect(0, y, x, h);
    ctx.clearRect(x + w, y, x, h);
    ctx.clearRect(0, y + h, SCREEN_WIDTH, y);
}

function fillRectAround(ctx, x, y, w, h) {

    // Top
    ctx.fillRect(0, 0, SCREEN_WIDTH, y);
    // Left
    ctx.fillRect(0, y, x, h);
    // Right
    ctx.fillRect(x + w, y, SCREEN_WIDTH - x + w, h);
    // Bottom
    ctx.fillRect(0, y + h, SCREEN_WIDTH, SCREEN_HEIGHT - y + h);
}

function drawInset(ctx, x, y, w, h, lineWidth, color, shadowColor) {

    const offset = lineWidth / 2;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = shadowColor;
    ctx.beginPath();
    ctx.moveTo(x - offset, y + h + offset);
    ctx.lineTo(x - offset, y - offset);
    ctx.lineTo(x + w + offset, y - offset);
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + w + offset, y - offset);
    ctx.lineTo(x + w + offset, y + h + offset);
    ctx.lineTo(x - offset, y + h + offset);
    ctx.stroke();
}