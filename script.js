const SCREEN_SCALE = 2.25;

const SCREEN = {
    width: 640 * SCREEN_SCALE,
    height: 480 * SCREEN_SCALE
};

const FOV = 70 * Math.PI / 180;
const CELLSIZE = 64;
const WALL_HEIGHT = SCREEN.height / 240;

const CEILING_COLOR = '#333';
const FLOOR_COLOR = '#777';
const OSD_COLOR = '#0f0';
const OSD_FONT = '20px sans-serif';

const MOVE_SPEEDS = {
    slow: CELLSIZE / 100 * 2,
    normal: CELLSIZE / 100 * 4,
    fast: CELLSIZE / 100 * 6
};
const TURN_RADIUS = Math.PI / 180 * 1.5;

let SHOW_FPS = JSON.parse(localStorage.getItem('SHOW_FPS')) ?? true;
let RENDER_SPRITES = JSON.parse(localStorage.getItem('RENDER_SPRITES')) ?? true;
let INTERLACED_RENDERING = JSON.parse(localStorage.getItem('INTERLACED_RENDERING')) ?? true;


const MAP = LEVEL_1.map;
const MAP_LEGEND = LEVEL_1.legend;
const DOOR_MAP = LEVEL_1.doors;
const DOOR_MAP_LEGEND = LEVEL_1.doorsLegend;

const OBJECTS = MAP.flatMap((row, y) => row.map((item, x) => ({
    x: (x + .5) * CELLSIZE,
    y: (y + .5) * CELLSIZE,
    ...MAP_LEGEND[item]
}))).filter(x => x.object);

const spritesImage = new Image();
spritesImage.src = LEVEL_1.spriteUrl;



const MINIMAP_ALPHA = .9;
const MINIMAP_SCALE = SCREEN.height / MAP.length / CELLSIZE / 2;
const MINIMAP_CELLRADIUS = 12;
const MINIMAP_RAYS = false;
const MINIMAP_NONE = 0;
const MINIMAP_SMALL = 1;
const MINIMAP_LARGE = 2;

/**
 * @type HTMLCanvasElement
 */
var canvas = document.getElementById('canvas');
canvas.width = SCREEN.width;
canvas.height = SCREEN.height;

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
    KeyU: () => SHOW_FPS = !SHOW_FPS,
    'KeyI': () => {
        INTERLACED_RENDERING = !INTERLACED_RENDERING
        setStatusText('INTERLACING ' + (INTERLACED_RENDERING ? 'ON' : 'OFF'));
    },
    KeyO: () => {
        RENDER_SPRITES = !RENDER_SPRITES
        setStatusText('SPRITES ' + (RENDER_SPRITES ? 'ON' : 'OFF'));
    },
    KeyR: () => {
        player = { ...playerDefaults };
    },
    KeyL: () => {
        ctx.imageSmoothingEnabled = !ctx.imageSmoothingEnabled;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code in controlsKeyboardMap) {
        controls[controlsKeyboardMap[e.code]] = true;
    }
});

document.addEventListener('keyup', (e) => {

    if (e.code in controlsKeyboardMap) {
        controls[controlsKeyboardMap[e.code]] = false;
    }
    if (e.code in controlsKeyboardToggleMap) {
        controls[controlsKeyboardToggleMap[e.code]] = !controls[controlsKeyboardToggleMap[e.code]];
    }
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

const playerDefaults = {
    x: 30 * CELLSIZE + CELLSIZE / 2,
    y: 50 * CELLSIZE + CELLSIZE / 2,
    angle: 0,
    speed: 0,
    side: 0
};

let player = JSON.parse(localStorage.getItem('player')) ?? { ...playerDefaults };

function iterateMap(map, fn) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            fn(x, y, map[y][x]);
        }
    }
}

let frameCounter = 0;
let last = performance.now();

function loop() {

    const now = performance.now();
    const delta = now - last;

    last = now;
    frameCounter++;

    try {
        if (!controls.pause) {
            movePlayer(delta);

            const rays = getRays(player);
            drawScene(rays);
            drawSprite(rays, OBJECTS);

            if (controls.map > 0) {
                drawMiniMap(MAP, rays, controls.map === MINIMAP_LARGE);
            }

            if (SHOW_FPS) {
                drawFps(fps.tick());
            }

            if (statusText) {
                drawStatusText(statusText);
            }
        }

        requestAnimationFrame(loop);
    } catch (error) {
        throw error;
    }
}

function startGame() {
    requestAnimationFrame(loop);
}

function viewCorrection(distance, viewAngle, playerAngle) {
    const difference = viewAngle - playerAngle;
    return distance * Math.cos(difference);
}

function isOutOfBounds(sx, sy, dw, dh) {
    return sx < 0 || sx >= dw || sy < 0 || sy >= dh;
}

function getHorizontalCollision(angle, player) {

    const up = Math.abs(Math.floor(angle / Math.PI) % 2) > 0;

    const mapY = up ? Math.floor(player.y / CELLSIZE) * CELLSIZE : Math.floor(player.y / CELLSIZE) * CELLSIZE + CELLSIZE;
    const mapX = player.x + (mapY - player.y) / Math.tan(angle);

    const stepY = up ? -CELLSIZE : CELLSIZE;
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
        const cellX = Math.floor(nextX / CELLSIZE);
        const cellY = up ? Math.floor(nextY / CELLSIZE) - 1 : Math.floor(nextY / CELLSIZE);

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
        spriteX: nextX - Math.floor(nextX / CELLSIZE) * CELLSIZE,
        vertical: false
    };
}

function getVerticalCollision(angle, player) {

    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2) > 0;

    const mapX = right ? Math.floor(player.x / CELLSIZE) * CELLSIZE + CELLSIZE : Math.floor(player.x / CELLSIZE) * CELLSIZE;
    const mapY = player.y + (mapX - player.x) * Math.tan(angle);

    const stepX = right ? CELLSIZE : -CELLSIZE;
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
        const cellX = right ? Math.floor(nextX / CELLSIZE) : Math.floor(nextX / CELLSIZE) - 1;;
        const cellY = Math.floor(nextY / CELLSIZE);

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
        spriteX: nextY - Math.floor(nextY / CELLSIZE) * CELLSIZE,
        vertical: true
    };
}

function getRays(player) {

    const start = player.angle - FOV / 2;
    const length = SCREEN.width;
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

    if (!controls.strafe && controls.left) {
        player.angle = fixAngle(player.angle - TURN_RADIUS * timeScale);
    }
    if (!controls.strafe && controls.right) {
        player.angle = fixAngle(player.angle + TURN_RADIUS * timeScale);
    }

    const speed = controls.turbo ? MOVE_SPEEDS.fast : MOVE_SPEEDS.normal;

    if (controls.up) {
        player.speed = speed * timeScale;
    }

    if (controls.down) {
        player.speed = -MOVE_SPEEDS.slow * timeScale;
    }

    if (!controls.up && !controls.down) {
        player.speed = 0;
    }

    if (controls.strafe && controls.left) {
        player.side = MOVE_SPEEDS.slow * timeScale;
    } else if (controls.strafe && controls.right) {
        player.side = -MOVE_SPEEDS.slow * timeScale;
    } else {
        player.side = 0;
    }

    if (controls.action) {
        let doorX = Math.floor((player.x + Math.cos(player.angle) * CELLSIZE) / CELLSIZE);
        let doorY = Math.floor((player.y + Math.sin(player.angle) * CELLSIZE) / CELLSIZE);

        if (DOOR_MAP[doorY][doorX] === 1) {
            DOOR_MAP[doorY][doorX] = 2;

            const autoClose = () => {
                setTimeout(() => {
                    // Make sure player isn't standing in door way.
                    const x = Math.floor(player.x / CELLSIZE),
                        y = Math.floor(player.y / CELLSIZE);

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

        let moveX = Math.cos(player.angle - Math.PI / 2) * player.side;
        let moveY = Math.sin(player.angle - Math.PI / 2) * player.side;

        if (!isIntersectingWall(player.x + moveX, player.y)) {
            player.x += moveX;
        }
        if (!isIntersectingWall(player.x, player.y + moveY)) {
            player.y += moveY;
        }
    }
}

function isIntersectingWall(x, y) {
    const mapX = Math.floor(x / CELLSIZE);
    const mapY = Math.floor(y / CELLSIZE);

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
        const wallHeight = ((CELLSIZE * WALL_HEIGHT) / distance) * 277;
        const wallY = SCREEN.height / 2 - wallHeight / 2;

        // Ceiling
        ctx.fillStyle = CEILING_COLOR;
        ctx.fillRect(i, 0, 1, wallY);

        // Floor
        ctx.fillStyle = FLOOR_COLOR;
        ctx.fillRect(i, wallY + wallHeight, 1, SCREEN.height / 2 + wallHeight / 2);

        // Wall
        if (!RENDER_SPRITES || !ray.sprite) {
            ctx.fillStyle = ray.color;
            ctx.fillRect(i, wallY, 1, wallHeight);
        } else {
            ctx.drawImage(spritesImage, ray.sprite.x + ray.spriteX, ray.sprite.y, 1, 64, i, wallY, 1, wallHeight)
        }
    }
}

function drawMiniMap(map, rays, largeMap) {

    // Use .floor to work with even numbers.
    const size = Math.floor(CELLSIZE * MINIMAP_SCALE);
    // Get the corrected scale after .floor
    const scale = size / CELLSIZE;
    const width = map[0].length * size;
    const height = map.length * size;
    const left = SCREEN.width / 2 - width / 2;
    const top = SCREEN.height / 2 - height / 2;
    const position = new Vector(player.x, player.y).multiply(scale).add(left, top);
    const radius = size * MINIMAP_CELLRADIUS;
    const translate = new Vector(0, 0).subtract(position).add(radius).add(size, SCREEN.height - radius * 2 - size);


    if (!largeMap) {
        // Translate and clip to a circle
        ctx.save();
        ctx.translate(translate.x, translate.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.clip();
    }

    // Set alpha
    ctx.globalAlpha = MINIMAP_ALPHA;

    // Floors
    ctx.fillStyle = '#bbb';
    ctx.fillRect(0, 0, screen.width, screen.height);

    // Walls
    iterateMap(map, (x, y, colorIndex) => {
        if (colorIndex === 0) {
            return;
        }
        ctx.fillStyle = MAP_LEGEND[colorIndex].color;
        ctx.fillRect(left + x * size, top + y * size, size, size);
    });

    // Doors
    iterateMap(DOOR_MAP, (x, y, colorIndex) => {
        if (colorIndex === 0) {
            return;
        }
        ctx.fillStyle = DOOR_MAP_LEGEND[colorIndex].color;
        if (DOOR_MAP_LEGEND[colorIndex].inset) {
            if (map[y - 1][x]) {
                // Vertical door
                ctx.fillRect(left + x * size + size/3, top + y * size, size / 3, size);
            } else {
                ctx.fillRect(left + x * size, top + y * size + size / 3, size, size / 3);
            }
        } else {
            ctx.fillRect(left + x * size, top + y * size, size, size);
        }
    });

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
    ctx.ellipse(position.x, position.y, CELLSIZE / 2 * scale, CELLSIZE / 3 * scale, player.angle + Math.PI / 2, 0, Math.PI * 2)
    ctx.fill();

    // Direction
    const destination = new Vector(Math.cos(player.angle), Math.sin(player.angle)).multiply(size).add(position);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(destination.x, destination.y);
    ctx.stroke();

    // Head
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(position.x, position.y, CELLSIZE / 4 * scale, 0, Math.PI * 2);
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
    ctx.fillText(display, SCREEN.width - (size.width + 5), 5);
}

function drawStatusText(text) {
    ctx.font = OSD_FONT;
    ctx.fillStyle = OSD_COLOR;
    ctx.textBaseline = 'top'

    ctx.fillText(text, 5, 5);
}

/**
 * Keeps the angle between -Math.PI and Math.PI. Required to be able to compare angles.
 * @param {number} angle 
 */
function fixAngle(angle) {
    if (angle < -Math.PI) {
        return angle + 2.0 * Math.PI;
    }
    if (angle > Math.PI) {
        return angle - 2.0 * Math.PI;
    }
    return angle;
}


function drawSprite(rays, objects) {

    objects.forEach(object => {

        const distance = Vector.distance(player.x, player.y, object.x, object.y);

        if (distance < CELLSIZE * .5) {
            return;
        }

        const angle = fixAngle(Math.atan2(object.y - player.y, object.x - player.x));
        const size = ((CELLSIZE * WALL_HEIGHT) / distance) * 277;
        const x = Math.floor(SCREEN.width / 2 - (player.angle - angle) * SCREEN.width / FOV - size / 2);

        for (let i = 0; i < size; i++) {
            if (x + i >= 0 && x + i < rays.length && rays[x + i].distance > distance) {
                ctx.drawImage(spritesImage, MAP_LEGEND[8].sprite.x + Math.floor(64 / size * i), MAP_LEGEND[8].sprite.y, 1, 64, x + i, SCREEN.height / 2 - size / 2, 1, size);
            }
        }
    });
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