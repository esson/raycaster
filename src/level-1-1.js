import Vector from './vector';
import { getSpritesheetCoordinates } from './sprites';

function createLevel() {

    const walls = [
        '                            3339333339333                      ',
        '     111111                 3           3                      ',
        '     1    1      111111181119           93333                  ',
        '     1    1      1          3           3   3                  ',
        '     1     1     1                          9                  ',
        '     1     1     1          3           3   3                  ',
        '     11611 11611 1   1118111c           c3333                  ',
        '     1         1 1   1      3           3                      ',
        '     8         811   111     33933 339333                      ',
        '     1         1       1        3   3                          ',
        '     1                 1        3   3                          ',
        '     1         1       1        c   c                          ',
        '111118         811161111        3   3                          ',
        '1   11         1                3   3                          ',
        '1   111611 1161            333333   333                        ',
        '1   1   1   1              3          3                        ',
        '11 11   8   8              3  333   333                        ',
        '1   11111   1              3  333   3                          ',
        '1   1   1   1              3  333   3                          ',
        '1       8   8              333339   9                          ',
        '1   1   1   1                   3   3                          ',
        '1   111111 11111                39 93                2222222222',
        '8   81         1          111181     1811111         2        2',
        '1   11         8          1               11         2        2',
        '1   11         1          6               622222222222        2',
        '1    1         1          1                2         2        2',
        '1              8          1                                   4',
        '1    1         1          1                2         2        2',
        '1   11         1          6               6222    2222        2',
        '1   11         8          1               11122  2   2        2',
        '1   11         1          117111     111711   2  2   2        2',
        '7   711111 11111               122 22         2  2   222 22 222',
        '1   11111   1                   2   2         2  2      2  2   ',
        '1   11111   1                   2   2         2  2             ',
        '1   1   1   1                   2   2         2  2  2 2 2 2    ',
        '1       8   8                   2   2         2  222 2 2 2 22  ',
        '1   1   1   1                   2   2         2   2         2  ',
        '1   11111   1                   2   2         2             4  ',
        '1   11111   1111111116111       2   2         2   2         2  ',
        '1                1      8e1     2   2         222222 2 2 2 22  ',
        '1                         a     2   2               2 2 2 2    ',
        '1                1      8e1     2   2                          ',
        '111111111171111111 116111       2   2                          ',
        '          e8  1     1      2222222 2222222                     ',
        '         a    1  1 1       2    2   2    2                     ',
        '          e8     11        2             2                     ',
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
        '1': { color: '#797979', darkColor: '#616161', sprite:  0, darkSprite:  1 }, // Stone Wall
        '2': { color: '#09096f', darkColor: '#070759', sprite: 14, darkSprite: 15 }, // Blue Stone Wall
        '3': { color: '#604220', darkColor: '#4d351a', sprite: 22, darkSprite: 23 }, // Wood Panel Wall
        '4': { color: '#09096f', darkColor: '#070759', sprite:  8, darkSprite:  9 }, // Blue Stone Wall - Cell
        '5': { color: '#09096f', darkColor: '#070759', sprite: 12, darkSprite: 13 }, // Blue Stone Wall - Cell Skeleton
        '6': { color: '#797979', darkColor: '#616161', sprite: 10, darkSprite: 11 }, // Stone Wall - Eagle Valve
        '7': { color: '#797979', darkColor: '#616161', sprite:  6, darkSprite:  7 }, // Stone Wall - Monster Painting
        '8': { color: '#797979', darkColor: '#616161', sprite:  4, darkSprite:  5 }, // Stone Wall - Flag
        '9': { color: '#604220', darkColor: '#4d351a', sprite: 18, darkSprite: 19 }, // Wood Panel Wall - Painting
        'a': { color: '#797979', darkColor: '#616161', sprite: 41, darkSprite: 41, next: 'b' }, // Elevator Controls Off Wall
        'b': { color: '#797979', darkColor: '#616161', sprite: 43, darkSprite: 43, next: 'a' }, // Elevator Controls On Wall
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

    const pushWalls = [
        '                            -------------                      ',
        '     ------                 -           -                      ',
        '     -    -      ------------           -----                  ',
        '     -    -      -          -           -   -                  ',
        '     -     -     -                          -                  ',
        '     -     -     -          -           -   -                  ',
        '     -----7----- -   --------           -----                  ',
        '     -         - -   -      -           -                      ',
        '     -         ---   ---     ----- ------                      ',
        '     -         -       -        -   -                          ',
        '     -                 -        -   -                          ',
        '     -         -       -        -   -                          ',
        '------         ---------        -   -                          ',
        '-   --         -                -   -                          ',
        '-   ------ ----            ------   ---                        ',
        '-   -   -   -              -  9       -                        ',
        '-- --   -   -              -  ---   ---                        ',
        '-   -----   -              -  ---   -                          ',
        '-   -   -   -              -  ---   -                          ',
        '-       -   -              ------   -                          ',
        '-   -   -   -                   -   -                          ',
        '-   ------ -----                -- --                ----------',
        '-   --         -          ------     -------         -        -',
        '-   --         -          -               --         -        -',
        '-   --         -          -               ------------        -',
        '-    -         -          -                -         -        -',
        '-              -          -                                   -',
        '-    -         -          -                -         -        -',
        '-   --         -          -               ----    ----        -',
        '-   --         -          -               -----  -   -        -',
        '-   --         -          ------     ------   -  -   -        -',
        '-   ------ -----               --- --         -  -   --- -- ---',
        '-   -----   -                   -   -         -  -      -  -   ',
        '-   -----   -                   -   -         -  -             ',
        '-   -   -   -                   -   -         -  -  - - - -    ',
        '-       -   -                   -   -         -  --- - - - --  ',
        '-   -   -   -                   -   -         -   -         -  ',
        '-   -----   -                   -   -         -             -  ',
        '-   -----   -------------       -   -         -   -         -  ',
        '-                -      ---     -   -         ------ - - - --  ',
        '-                         -     -   -               - - - -    ',
        '-                -      ---     -   -                          ',
        '------------------1------       -   -                          ',
        '          --  -  1  -      ------- -------                     ',
        '         -    -  - -       -    -   -    -                     ',
        '          --     --        -             -                     ',
        '            -1----         -    -   -    -                     ',
        '            -  -           -    -   -    -                     ',
        '            -  -           ------   ------                     ',
        '            ----           -    -   -    -                     ',
        '                           -             -                     ',
        '                           -    -   -    -                     ',
        '                           ------   ------                     ',
        '                           -             -                     ',
        '                           -             -                     ',
        '                           -             -                     ',
        '                           ---------------                     '
    ];

    const doors = [
        '                            -------------                      ',
        '     ------                 -           -                      ',
        '     -    -      ------------           -----                  ',
        '     -    -      -          -           -   -                  ',
        '     -     -     -          1           1   -                  ',
        '     -     -     -          -           -   -                  ',
        '     ----- ----- -   --------           -----                  ',
        '     -         - -   -      -           -                      ',
        '     -         ---   ---     -----1------                      ',
        '     -         -       -        -   -                          ',
        '     -         1       -        -   -                          ',
        '     -         -       -        -   -                          ',
        '------         ---------        -   -                          ',
        '-   --         -                -   -                          ',
        '-   ------1----            ------   ---                        ',
        '-   -   -   -              -          -                        ',
        '--1--   -   -              -  ---   ---                        ',
        '-   -----   -              -  ---   -                          ',
        '-   -   -   -              -  ---   -                          ',
        '-       -   -              ------   -                          ',
        '-   -   -   -                   -   -                          ',
        '-   ------1-----                --1--                ----------',
        '-   --         -          ------     -------         -        -',
        '-   --         -          -               --         -        -',
        '-   --         -          -               ------------        -',
        '-    -         -          -                -         -        -',
        '-    1         -          -                1         1        -',
        '-    -         -          -                -         -        -',
        '-   --         -          -               ----    ----        -',
        '-   --         -          -               -----  -   -        -',
        '-   --         -          ------     ------   -  -   -        -',
        '-   ------1-----               ---1--         -  -   --- -- ---',
        '-   -----   -                   -   -         -  -      -  -   ',
        '-   -----   -                   -   -         -  -             ',
        '-   -   -   -                   -   -         -  -  - - - -    ',
        '-       -   -                   -   -         -  --- - - - --  ',
        '-   -   -   -                   -   -         -   -         -  ',
        '-   -----   -                   -   -         -   1         -  ',
        '-   -----   -------------       -   -         -   -         -  ',
        '-                -      ---     -   -         ------ - - - --  ',
        '-                1      2 -     -   -               - - - -    ',
        '-                -      ---     -   -                          ',
        '------------------ ------       -   -                          ',
        '          --  -     -      -------1-------                     ',
        '         - 2  -  - -       -    -   -    -                     ',
        '          --     --        -    1   1    -                     ',
        '            - ----         -    -   -    -                     ',
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
        '2': { color: '#cccccc', darkColor: '#dddddd', sprite: 102, darkSprite: 103, frameColor: '#cccccc', frameDarkColor: '#dddddd', frameSprite: 100, frameDarkSprite: 101, action: 2, position: 0, ticks: 0 }, // Elevator Door
    };

    const objects = [
        '                            -------------                      ',
        '     ------                 -8         8-                      ',
        '     -    -      ------------  a  a  a  -----                  ',
        '     -    -      -          -           -   -                  ',
        '     -     -     - 2    2         6         -                  ',
        '     -     -     -          -           -   -                  ',
        '     ----- ----- -   --------           -----                  ',
        '     -   1 1   - -   -      -           -                      ',
        '     - b     b ---   ---     ----- ------                      ',
        '     -         -       -        -   -                          ',
        '     -c   a        2   -        -   -                          ',
        '     -         -       -        -   -                          ',
        '------ b     b ---------        -   -                          ',
        '-  d--         -                -   -                          ',
        '- 2 ------ ----            ------   ---                        ',
        '-   -   -   -              -         9-                        ',
        '-- --   - 2 -              -  ---   ---                        ',
        '-   -----   -              -  ---   -                          ',
        '- 2 -   -   -              -  ---   -                          ',
        '-     2 - 2 -              ------   -                          ',
        '-   -   -   -                   -   -                          ',
        '-   ------ -----                -- --                ----------',
        '- 2 --         -          ------7   7-------         -    fddd-',
        '-   -- 7     7 -          -7             7--         -       d-',
        '-   --  2   2  -          -               ------------        -',
        '-    -         -          -                -         -        -',
        '-              -          -  6    6    6                      -',
        '-    -         -          -                -         -        -',
        '-   --  2   2  -          -               ----    ----  i  i  -',
        '-   -- 7     7 -          -7             7-----  -   -        -',
        '-   --         -          ------     ------   -  -   -        -',
        '- 2 ------ -----               --- --         -  -   ---h--g---',
        '-   -----   -                   -   -         -  -      -  -   ',
        '-   -----   -                   - 2 -         -  -             ',
        '-   -  e-   -                   -   -         -  -  - - - -    ',
        '-       -   -                   -   -         -  --- - - - --  ',
        '-   -   -   -                   -   -         -   -         -  ',
        '- 2 -----   -                   - 2 -         -             -  ',
        '-   -----   -------------       -   -         -   -        j-  ',
        '-                -      ---     -   -         ------ - - - --  ',
        '-     2       2           -     -   -               - - - -    ',
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
        '1': { sprite: 116, solid: true }, // Tree
        '2': { sprite: 122 }, // Ceiling Light
        '3': { sprite: 201 }, // Corpse
        '4': { sprite: 127 }, // Bone pile
        '5': { sprite: 117 }, // Skeleton flat
        '6': { sprite: 112 }, // Chandeleir
        '7': { sprite: 119, solid: true }, // Potted plant
        '8': { sprite: 120, solid: true }, // Pot empty
        '9': { sprite: 124, solid: true }, // Armour Knight
        'a': { sprite: 110, solid: true }, // Dining table
        'b': { sprite: 111, solid: true }, // Floor lamp
        'c': { sprite: 147, solid: true }, // Floor flag
        'd': { sprite: 143, solid: true }, // Wood barrel
        'e': { sprite: 109, solid: true }, // Steel barrel
        'f': { sprite: 108 }, // Water
        'g': { sprite: 145, solid: true }, // Well empty
        'h': { sprite: 144, solid: true }, // Well with water
        'i': { sprite: 121, solid: true }, // Table
        'j': { sprite: 131 }, // Basket
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
        pushWalls: pushWalls.map(mapLiteralToSpriteObject(wallSprites, false)).map((row, y) => row.map((col, x) => {
            if (col) {
                col.action = 0;
                col.position = 0;
                col.dirX = 0;
                col.dirY = 0;
            }
            return col;
        })),
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

const level_1_1 = createLevel();

export default level_1_1;