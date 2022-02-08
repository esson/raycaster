import './styles.css';
import Vector from './vector';
import level_1_1 from './level-1-1'
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

const OSD_BACKGORUND = '#00000033';
const OSD_COLOR = '#fff';
const OSD_FONT = '12px monospace';
const OSD_HEIGHT = 20;
const OSD_MIDDLE = OSD_HEIGHT / 2;

const MOVE_SLOW = .02;
const MOVE_NORMAL = .04;
const MOVE_FAST = .06;

const TURN_RADIUS = DEG_TO_PI * 1.5;

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

const PLAYER_DEFAULT = {
    angle: 0,
    speed: 0,
    side: 0
};

// Settings
//

let SHOW_DEBUG = JSON.parse(localStorage.getItem('SHOW_FPS')) ?? true;
let SHOW_GRAPHS = JSON.parse(localStorage.getItem('SHOW_GRAPHS')) ?? true;
let RENDER_SPRITES = JSON.parse(localStorage.getItem('RENDER_SPRITES')) ?? true;
let RENDER_INTERLACED = JSON.parse(localStorage.getItem('RENDER_INTERLACED')) ?? true;
let WALL_COLLISION = JSON.parse(localStorage.getItem('WALL_COLLISION')) ?? true;

// Level / Map / Doors / Objects
//

const LEVEL = level_1_1;

const WALLS = LEVEL.walls;
const DOORS = LEVEL.doors;
const OBJECTS = LEVEL.objects;

// Spritesheet
//

const spritesheet = new Image();
spritesheet.src = LEVEL.spriteUrl;
spritesheet.onload = () => {

    // Remove the loader to prevent looping behaviour.
    spritesheet.onload = null;

    // The sprite image doesn't contain opacity data, 
    // so we need to turn all pink colors to 0 alpha.
    // To do that we create a canvas and draw the 
    // spritesheet onto it. Then we can get the image data
    // from the canvas and modify it, put the modified
    // data back onto the canvas and get a Data URL to
    // apply to the spritesheet ImageElement.

    const canvas = document.createElement('canvas');
    canvas.width = spritesheet.width;
    canvas.height = spritesheet.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(spritesheet, 0, 0);

    const imageData = ctx.getImageData(0, 0, spritesheet.width, spritesheet.height);
    const data = imageData.data;

    // Convert rgba(152, 0, 136, 255) to transparent.
    for (let i = 0; i < data.length; i += 4) {

        if (data[i] !== 152 || data[i + 1] !== 0 || data[i + 2] !== 136) {
            continue;
        }

        data[i + 3] = 0;
    }

    ctx.putImageData(imageData, 0, 0);
    spritesheet.src = canvas.toDataURL();

    canvas.remove();

    startGame();
};

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
    map: MINIMAP_SMALL,
    action: false,
    pause: false
};

const keyboardToControlMap = {
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

const keyboardToControlToggleMap = {
    Escape: 'pause'
};

const keyboardToFunctionMap = {
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
    KeyR: () => (setMessageText('PLAYER RESET'), player = { ...PLAYER_DEFAULT, x: LEVEL.spawn.x, y: LEVEL.spawn.y })
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

// State Save
//

window.addEventListener('unload', (e) => {

    localStorage.setItem('player', JSON.stringify(player));

    localStorage.setItem('SHOW_DEBUG', JSON.stringify(SHOW_DEBUG));
    localStorage.setItem('SHOW_GRAPHS', JSON.stringify(SHOW_GRAPHS));

    localStorage.setItem('RENDER_INTERLACED', JSON.stringify(RENDER_INTERLACED));
    localStorage.setItem('RENDER_SPRITES', JSON.stringify(RENDER_SPRITES));
});

// Player
//
let player = JSON.parse(localStorage.getItem('player')) ?? { ...PLAYER_DEFAULT, x: LEVEL.spawn.x, y: LEVEL.spawn.y };

// Game Loop
//

function startGame() {
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
}

function render(rays) {

    if (!RENDER_INTERLACED) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    renderScene(ctx, rays);
    renderObjects(ctx, rays, OBJECTS);

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
    let door;

    let nextX = mapX;
    let nextY = mapY;

    let color;
    let sprite;
    let spriteOffsetX = 0;

    while (true) {

        const cellX = Math.floor(nextX);
        const cellY = up ? Math.floor(nextY) - 1 : Math.floor(nextY);

        if (isOutOfBounds(cellX, cellY, WALLS[0].length, WALLS.length)) {
            break;
        }

        wall = WALLS[cellY][cellX];

        if (wall) {
            // If cell is adjacent to wall, we render door frame
            let adjacentDoor = up ? DOORS[cellY + 1][cellX] : DOORS[cellY - 1][cellX];

            if (adjacentDoor) {
                color = adjacentDoor.frameDarkColor;
                sprite = adjacentDoor.frameDarkSprite;
            } else {
                color = wall.darkColor;
                sprite = wall.darkSprite;
            }

            break;
        }

        door = DOORS[cellY][cellX];

        // Special logic for the doors, they are inset by half step and can be opening/closing.
        if (door && door.action !== DOOR_OPEN) {

            // If door is opening or closing, we check if we hit it.
            if (door.action === DOOR_CLOSED || nextX + halfStepX - Math.floor(nextX + halfStepX) > door.position) {

                color = door.darkColor;
                sprite = door.darkSprite;
                spriteOffsetX = -door.position;

                nextX += halfStepX;
                nextY += halfStepY;

                break;
            }
        }

        nextX += stepX;
        nextY += stepY;
    }

    return {
        angle,
        distance: Vector.distance(player.x, player.y, nextX, nextY),
        color: color,
        sprite: sprite,
        spriteX: (spriteOffsetX + nextX - Math.floor(nextX)) * SPRITE_SIZE,
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
    let spriteOffsetX = 0;

    while (true) {

        const cellX = right ? Math.floor(nextX) : Math.floor(nextX) - 1;;
        const cellY = Math.floor(nextY);

        if (isOutOfBounds(cellX, cellY, WALLS[0].length, WALLS.length)) {
            break;
        }

        wall = WALLS[cellY][cellX];

        if (wall) {
            // If cell is adjacent to wall, we render door frame
            let adjacentDoor = right ? DOORS[cellY][cellX - 1] : DOORS[cellY][cellX + 1];

            if (adjacentDoor) {
                color = adjacentDoor.frameColor;
                sprite = adjacentDoor.frameSprite;
            } else {
                color = wall.color;
                sprite = wall.sprite;
            }

            break;
        }

        door = DOORS[cellY][cellX];

        // Special logic for the doors, they are inset by half step and can be opening/closing.
        if (door && door.action !== DOOR_OPEN) {

            // If door is opening or closing, we check if we hit it.
            if (door.action === DOOR_CLOSED || nextY + halfStepY - Math.floor(nextY + halfStepY) > door.position) {

                color = door.color;
                sprite = door.sprite;
                spriteOffsetX = -door.position;

                nextX += halfStepX;
                nextY += halfStepY;

                break;
            }
        }

        nextX += stepX;
        nextY += stepY;
    }

    return {
        angle,
        distance: Vector.distance(player.x, player.y, nextX, nextY),
        color: color,
        sprite: sprite,
        spriteX: (spriteOffsetX + nextY - Math.floor(nextY)) * SPRITE_SIZE,
        vertical: true
    };
}

function getRays(player) {

    const start = player.angle - FOV / 2;
    const step = FOV / SCREEN_WIDTH;
    const rays = [];

    for (let i = 0; i < SCREEN_WIDTH; i++) {

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

    // Action / Open Doors

    if (controls.action) {

        let doorX = Math.floor(player.x + Math.cos(player.angle));
        let doorY = Math.floor(player.y + Math.sin(player.angle));

        let door = DOORS[doorY][doorX];

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

        controls.action = false;
    }

    // Move the Player

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

function moveDoors(delta) {

    for (let y = 0; y < DOORS.length; y++) {
        for (let x = 0; x < DOORS[y].length; x++) {

            const door = DOORS[y][x];

            if (!door) {
                continue;
            }

            switch (door.action) {
                case DOOR_OPEN:
                    door.ticks += delta;

                    if (door.ticks >= DOOR_OPEN_TICKS && (Math.floor(player.x) != x || Math.floor(player.y) != y)) {
                        door.action = DOOR_CLOSING;
                    }

                    break;
                case DOOR_OPENING:
                    door.position += delta / 1000;

                    if (door.position >= 1) {
                        door.position = 1;
                        door.ticks = 0;
                        door.action = DOOR_OPEN;
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

function isIntersectingWall(x, y) {

    if (!WALL_COLLISION) {
        return false;
    }

    const mapX = Math.floor(x);
    const mapY = Math.floor(y);

    const wall = WALLS[mapY][mapX];

    if (wall) {
        return true;
    }

    const door = DOORS[mapY][mapX];

    if (door && door.action !== DOOR_OPEN) {
        return true;
    }

    return false;
}

function renderScene(ctx, rays) {

    let x = RENDER_INTERLACED && frameCounter % 2 === 0 ? 1 : 0;
    let increment = RENDER_INTERLACED ? 2 : 1;

    for (; x < rays.length; x += increment) {

        const ray = rays[x];

        const distance = getViewCorrectedDistance(ray.distance, ray.angle, player.angle);
        const height = WALL_HEIGHT / distance * 277;
        const y = SCREEN_HEIGHT / 2 - height / 2;

        // Ceiling
        ctx.fillStyle = CEILING_COLOR;
        ctx.fillRect(x, 0, 1, y);

        // Floor
        ctx.fillStyle = FLOOR_COLOR;
        ctx.fillRect(x, y + height, 1, y);

        // Wall
        if (!RENDER_SPRITES || !ray.sprite) {
            ctx.fillStyle = ray.color ?? '#000';
            ctx.fillRect(x, y, 1, height);
        } else {
            ctx.drawImage(spritesheet, ray.sprite.x + ray.spriteX, ray.sprite.y, 1, SPRITE_SIZE, x, y, 1, height);
        }
    }
}

function renderObjects(ctx, rays, objects) {

    // TODO: Sort the objects by distance, furthest to nearest.

    for (let mapY = 0; mapY < objects.length; mapY++) {
        for (let mapX = 0; mapX < objects[mapY].length; mapX++) {
            const object = objects[mapY][mapX];

            if (!object) {
                continue;
            }

            const distance = Vector.distance(player.x, player.y, object.x, object.y);

            // Don't draw too close
            if (distance < .5) {
                return;
            }

            const angle = fixAngle(Math.atan2(object.y - player.y, object.x - player.x));
            const size = WALL_HEIGHT / distance * 277;
            const x = Math.floor(SCREEN_WIDTH / 2 - (player.angle - angle) * SCREEN_WIDTH / FOV - size / 2);

            for (let j = 0; j < size; j++) {
                if (x + j >= 0 && x + j < rays.length && rays[x + j].distance > distance) {
                    ctx.drawImage(spritesheet, object.sprite.x + Math.floor(SPRITE_SIZE / size * j), object.sprite.y, 1, SPRITE_SIZE, x + j, SCREEN_HEIGHT / 2 - size / 2, 1, size);
                }
            }
        }


    }
}

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

    // Walls
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {

            const wall = map[y][x];

            if (!wall) {
                continue;
            }

            ctx.fillStyle = wall.color;
            ctx.fillRect(left + x * scale, top + y * scale, scale, scale);
        }
    }

    // Doors
    for (let y = 0; y < DOORS.length; y++) {
        for (let x = 0; x < DOORS[0].length; x++) {

            const door = DOORS[y][x];

            if (!door || door.action === DOOR_OPEN) {
                continue;
            }

            ctx.fillStyle = door.color;

            if (map[y - 1][x]) {
                // Vertical door
                ctx.fillRect(left + x * scale + scale / 3, top + y * scale, scale / 3, scale);
            } else {
                // Horizontal door
                ctx.fillRect(left + x * scale, top + y * scale + scale / 3, scale, scale / 3);
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

    ctx.fillText(`${player.x.toFixed(0)},${player.y.toFixed(0)}`, SCREEN_SAFEZONE * 2, SCREEN_SAFEZONE + OSD_MIDDLE);
}

function renderMessage(ctx, text) {

    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, SCREEN_WIDTH / 2, SCREEN_SAFEZONE + OSD_MIDDLE);
}