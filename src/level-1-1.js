import Vector from './vector';

function createLevel() {

    const walls = [
        '                            3333333333333                      ',
        '     111111                 3           3                      ',
        '     1    1      111111111113           33333                  ',
        '     1    1      1          3           3   3                  ',
        '     1     1     1                          3                  ',
        '     1     1     1          3           3   3                  ',
        '     11111 11111 1   11111113           33333                  ',
        '     1         1 1   1      3           3                      ',
        '     1         111   111     33333 333333                      ',
        '     1         1       1        3   3                          ',
        '     1                 1        3   3                          ',
        '     1         1       1        c   c                          ',
        '111111         111111111        3   3                          ',
        '1   11         1                3   3                          ',
        '1   111111 1111            333333   333                        ',
        '1   1   1   1              3          3                        ',
        '11 11   1   1              3  333   333                        ',
        '1   11111   1              3  333   3                          ',
        '1   1   1   1              3  333   3                          ',
        '1       1   1              333339   9                          ',
        '1   1   1   1                   3   3                          ',
        '1   111111 11111                39 93                2222222222',
        '1   11         1          111181     1811111         2        2',
        '1   11         1          1               11         2        2',
        '1   11         1          6               622222222222        2',
        '1    1         1          1                2         2        2',
        '1              1          1                                   2',
        '1    1         1          1                2         2        2',
        '1   11         1          6               6222    2222        2',
        '1   11         1          1               11122  2   2        2',
        '1   11         1          117111     111711   2  2   2        2',
        '1   111111 11111               122 22         2  2   222 22 222',
        '1   11111   1                   2   2         2  2      2  2   ',
        '1   11111   1                   2   2         2  2             ',
        '1   1   1   1                   2   2         2  2  2 2 2 2    ',
        '1       1   1                   2   2         2  222 2 2 2 22  ',
        '1   1   1   1                   2   2         2   2         2  ',
        '1   11111   1                   2   2         2             2  ',
        '1   11111   1111111111111       2   2         2   2         2  ',
        '1                1      1e1     2   2         222222 2 2 2 22  ',
        '1                         a     2   2               2 2 2 2    ',
        '1                1      1e1     2   2                          ',
        '111111111111111111 111111       2   2                          ',
        '          11  1     1      2222222 2222222                     ',
        '         1    1  1 1       2    2   2    2                     ',
        '          11     11        2             2                     ',
        '            1 1111         2    2   2    2                     ',
        '            1  1           2    2   2    2                     ',
        '            1  1           222222   222222                     ',
        '            1111           2    2   2    2                     ',
        '                           2             2                     ',
        '                           2    2   2    2                     ',
        '                           222222   222222                     ',
        '                           2             2                     ',
        '                           2             2                     ',
        '                           2             2                     ',
        '                           242242252242242                     '
    ];

    const wallSprites = {
        '1': { color: '#797979', darkColor: '#616161', sprite: 0, darkSprite: 1 }, // Stone Wall
        '2': { color: '#09096f', darkColor: '#070759', sprite: 14, darkSprite: 15 }, // Blue Stone Wall
        '3': { color: '#604220', darkColor: '#4d351a', sprite: 22, darkSprite: 23 }, // Wood Panel Wall
        '4': { color: '#09096f', darkColor: '#070759', sprite:  8, darkSprite:  9 }, // Blue Stone Wall - Cell
        '5': { color: '#09096f', darkColor: '#070759', sprite: 12, darkSprite: 13 }, // Blue Stone Wall - Cell Skeleton
        '6': { color: '#797979', darkColor: '#616161', sprite: 10, darkSprite: 11 }, // Stone Wall - Eagle Valve
        '7': { color: '#797979', darkColor: '#616161', sprite:  6, darkSprite:  7 }, // Stone Wall - Monster Painting
        '8': { color: '#797979', darkColor: '#616161', sprite:  4, darkSprite:  5 }, // Stone Wall - Flag
        '9': { color: '#604220', darkColor: '#4d351a', sprite: 18, darkSprite: 19 }, // Wood Panel Wall - Painting
        'a': { color: '#797979', darkColor: '#616161', sprite: 43, darkSprite: 43, next: 'b' }, // Elevator Controls Off Wall
        'b': { color: '#797979', darkColor: '#616161', sprite: 41, darkSprite: 41, next: 'a' }, // Elevator Controls On Wall
        'c': { color: '#604220', darkColor: '#4d351a', sprite: 20, darkSprite: 21 }, // Wood Panel Wall - Monster Painting
        'e': { color: '#797979', darkColor: '#616161', sprite: 40, darkSprite: 40 }, // Elevator Side Wall
    };

    // Link walls that references each other, like a toggle switch
    for (const key in wallSprites) {
        if (Object.hasOwnProperty.call(wallSprites, key)) {
            const wallSprite = wallSprites[key];
            if (wallSprite.next) {
                wallSprite.next = wallSprites[wallSprite.next];
            }
        }
    }

    const doors = [
        '                            -------------                      ',
        '     ------                 -           -                      ',
        '     -    -      ------------           -----                  ',
        '     -    -      -          -           -   -                  ',
        '     -     -     -          1           1   -                  ',
        '     -     -     -          -           -   -                  ',
        '     -----1----- -   --------           -----                  ',
        '     -         - -   -      -           -                      ',
        '     -         ---   ---     -----1------                      ',
        '     -         -       -        -   -                          ',
        '     -         1       -        -   -                          ',
        '     -         -       -        -   -                          ',
        '------         ---------        -   -                          ',
        '-   --         -                -   -                          ',
        '-   ------ ----            ------   ---                        ',
        '-   -   -   -              -          -                        ',
        '-- --   -   -              -  ---   ---                        ',
        '-   -----   -              -  ---   -                          ',
        '-   -   -   -              -  ---   -                          ',
        '-       -   -              ------   -                          ',
        '-   -   -   -                   -   -                          ',
        '-   ------ -----                --1--                ----------',
        '-   --         -          ------     -------         -        -',
        '-   --         -          -               --         -        -',
        '-   --         -          -               ------------        -',
        '-    -         -          -                -         -        -',
        '-              -          -                1         1        -',
        '-    -         -          -                -         -        -',
        '-   --         -          -               ----    ----        -',
        '-   --         -          -               -----  -   -        -',
        '-   --         -          ------     ------   -  -   -        -',
        '-   ------ -----               ---1--         -  -   --- -- ---',
        '-   -----   -                   -   -         -  -      -  -   ',
        '-   -----   -                   -   -         -  -             ',
        '-   -   -   -                   -   -         -  -  - - - -    ',
        '-       -   -                   -   -         -  --- - - - --  ',
        '-   -   -   -                   -   -         -   -         -  ',
        '-   -----   -                   -   -         -   1         -  ',
        '-   -----   -------------       -   -         -   -         -  ',
        '-                -      ---     -   -         ------ - - - --  ',
        '-                       2 -     -   -               - - - -    ',
        '-                -      ---     -   -                          ',
        '------------------1------       -   -                          ',
        '          --  -  1  -      -------1-------                     ',
        '         -    -  - -       -    -   -    -                     ',
        '          --     --        -    1   1    -                     ',
        '            -1----         -    -   -    -                     ',
        '            -  -           -    -   -    -                     ',
        '            -  -           ------   ------                     ',
        '            ----           -    -   -    -                     ',
        '                           -    1   1    -                     ',
        '                           -    -   -    -                     ',
        '                           ------   ------                     ',
        '                           -             -                     ',
        '                           -             -                     ',
        '                           -             -                     ',
        '                           ---------------                     '
    ];

    const doorSprites = {
        '1': { color: '#00a4a4', darkColor: '#297979', sprite: 98, darkSprite: 99, frameColor: '#00a4a4', frameDarkColor: '#297979', frameSprite: 100, frameDarkSprite: 101, action: 2, position: 0, ticks: 0 }, // Normal Door
        '2': { color: '#cccccc', darkColor: '#dddddd', sprite: 24, darkSprite: 25, frameColor: '#cccccc', frameDarkColor: '#dddddd', frameSprite: 100, frameDarkSprite: 101, action: 2, position: 0, ticks: 0 }, // Elevator Door
    };

    const objects = [
        '                            -------------                      ',
        '     ------                 -           -                      ',
        '     -    -      ------------           -----                  ',
        '     -    -      -          -           -   -                  ',
        '     -     -     -                          -                  ',
        '     -     -     -          -           -   -                  ',
        '     ----- ----- -   --------           -----                  ',
        '     -         - -   -      -           -                      ',
        '     -         ---   ---     ----- ------                      ',
        '     -         -       -        -   -                          ',
        '     -                 -        -   -                          ',
        '     -         -       -        -   -                          ',
        '------         ---------        -   -                          ',
        '-   --         -                -   -                          ',
        '-   ------ ----            ------   ---                        ',
        '-   -   -   -              -         8-                        ',
        '-- --   -   -              -  ---   ---                        ',
        '-   -----   -              -  ---   -                          ',
        '-   -   -   -              -  ---   -                          ',
        '-       -   -              ------   -                          ',
        '-   -   -   -                   -   -                          ',
        '-   ------ -----                -- --                ----------',
        '-   --         -          ------7   7-------         -        -',
        '-   --         -          -7             7--         -        -',
        '-   --         -          -               ------------        -',
        '-    -         -          -                -         -        -',
        '-              -          -  6    6    6                      -',
        '-    -         -          -                -         -        -',
        '-   --         -          -               ----    ----        -',
        '-   --         -          -7             7-----  -   -        -',
        '-   --         -          ------     ------   -  -   -        -',
        '-   ------ -----               --- --         -  -   --- -- ---',
        '-   -----   -                   -   -         -  -      -  -   ',
        '-   -----   -                   - 2 -         -  -             ',
        '-   -   -   -                   -   -         -  -  - - - -    ',
        '-       -   -                   -   -         -  --- - - - --  ',
        '-   -   -   -                   -   -         -   -         -  ',
        '-   -----   -                   - 2 -         -             -  ',
        '-   -----   -------------       -   -         -   -         -  ',
        '-                -      ---     -   -         ------ - - - --  ',
        '-                         -     -   -               - - - -    ',
        '-                -      ---     - 2 -                          ',
        '------------------ ------       -   -                          ',
        '          --  -     -      ------- -------                     ',
        '         -    -  - -       -4   -   -    -                     ',
        '          --     --        -      2   5  -                     ',
        '            - ----         -    -   -    -                     ',
        '            -  -           -    -   -    -                     ',
        '            -  -           ------   ------                     ',
        '            ----           -    -   -    -                     ',
        '                           -   3  2     4-                     ',
        '                           -    -   -    -                     ',
        '                           ------   ------                     ',
        '                           -             -                     ',
        '                           -  2       2  -                     ',
        '                           -             -                     ',
        '                           ---------------                     '
    ];

    const objectSprites = {
        '1': { sprite: 116 }, // Tree
        '2': { sprite: 122 }, // Ceiling Light
        '3': { sprite: 201 }, // Corpse
        '4': { sprite: 127 }, // Bone pile
        '5': { sprite: 117 }, // Skeleton flat
        '6': { sprite: 112 }, // Chandeleir
        '7': { sprite: 119 }, // Potted plant
        '8': { sprite: 124 }, // Armour Knight
    };

    Object.keys(wallSprites).map(key => wallSprites[key]).forEach(x => x.sprite = getSpritesheetCoordinates(x.sprite));
    Object.keys(wallSprites).map(key => wallSprites[key]).forEach(x => x.darkSprite = getSpritesheetCoordinates(x.darkSprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.sprite = getSpritesheetCoordinates(x.sprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.darkSprite = getSpritesheetCoordinates(x.darkSprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.frameSprite = getSpritesheetCoordinates(x.frameSprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.frameDarkSprite = getSpritesheetCoordinates(x.frameDarkSprite));
    Object.keys(objectSprites).map(key => objectSprites[key]).forEach(x => x.sprite = getSpritesheetCoordinates(x.sprite));

    return {
        spawn: new Vector(29, 50).add(.5),

        ceiling: '#383838',
        floor: '#707070',

        walls: walls.map(mapLiteralToSpriteObject(wallSprites, true)),
        doors: doors.map(mapLiteralToSpriteObject(doorSprites, false)),
        objects: objects.map(mapLiteralToSpriteObject(objectSprites, false, true)),

        spriteUrl: 'sprites.png'
    };
}

function mapLiteralToSpriteObject(spriteObjects, shared = false, coordinates = false) {

    if (coordinates) {
        return (row, y) => row.split('').map((col, x) => col === ' ' || col === '-' ? undefined : { ...spriteObjects[col], x: parseInt(x) + .5, y: y + .5 });
    }

    if (shared) {
        return (y) => y.split('').map(x => x === ' ' || x === '-' ? undefined : spriteObjects[x]);
    }

    return (y) => y.split('').map(x => x === ' ' || x === '-' ? undefined : { ...spriteObjects[x] });
}

/**
 * Converts a spritesheet index to actual pixel coordinates, given all sprites are square.
 * @param {number} index The index of the image.
 * @param {number} cols The number of sprite columns in the sprite sheet.
 * @param {number} size The width/height of a sprite.
 * @returns 
 */
function getSpritesheetCoordinates(index, cols = 16, size = 65) {
    return new Vector(index % cols, Math.floor(index / cols)).multiply(size);
}

const level_1_1 = createLevel();

export default level_1_1;