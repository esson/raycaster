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
        '     1         1       1        3   3                          ',
        '111111         111111111        3   3                          ',
        '1   11         1                3   3                          ',
        '1   111111 1111            333333   333                        ',
        '1   1   1   1              3          3                        ',
        '11 11   1   1              3  333   333                        ',
        '1   11111   1              3  333   3                          ',
        '1   1   1   1              3  333   3                          ',
        '1       1   1              333333   3                          ',
        '1   1   1   1                   3   3                          ',
        '1   111111 11111                33 33                2222222222',
        '1   11         1          111111     1111111         2        2',
        '1   11         1          1               11         2        2',
        '1   11         1          1               122222222222        2',
        '1    1         1          1                2         2        2',
        '1              1          1                                   2',
        '1    1         1          1                2         2        2',
        '1   11         1          1               1222    2222        2',
        '1   11         1          1               11122  2   2        2',
        '1   11         1          111111     111111   2  2   2        2',
        '1   111111 11111               122 22         2  2   222 22 222',
        '1   11111   1                   2   2         2  2      2  2   ',
        '1   11111   1                   2   2         2  2             ',
        '1   1   1   1                   2   2         2  2  2 2 2 2    ',
        '1       1   1                   2   2         2  222 2 2 2 22  ',
        '1   1   1   1                   2   2         2   2         2  ',
        '1   11111   1                   2   2         2             2  ',
        '1   11111   1111111111111       2   2         2   2         2  ',
        '1                1      111     2   2         222222 2 2 2 22  ',
        '1                         1     2   2               2 2 2 2    ',
        '1                1      111     2   2                          ',
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
        '                           222222222222222                     '
    ];

    const wallSprites = {
        '1': { color: '#797979', darkColor: '#616161', sprite: 0, darkSprite: 1 }, // Stone Wall
        '2': { color: '#09096f', darkColor: '#070759', sprite: 14, darkSprite: 15 }, // Blue Stone Wall
        '3': { color: '#604220', darkColor: '#4d351a', sprite: 22, darkSprite: 23 }, // Wood Panel Wall
    };

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
        '-   -   -   -              -  1       -                        ',
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
        '1': { color: '#00a4a4', darkColor: '#297979', sprite: 98, darkSprite: 99, frameColor: '#00a4a4', frameDarkColor: '#297979', frameSprite: 100, frameDarkSprite: 101, inset: true, open: false }, // Normal Door
        '2': { color: '#cccccc', darkColor: '#dddddd', sprite: 24, darkSprite: 25, frameColor: '#cccccc', frameDarkColor: '#dddddd', frameSprite: 100, frameDarkSprite: 101, inset: true, open: false }, // Elevator Door
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
        '-   -   -   -              -          -                        ',
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
        '------------------ ------       -   -                          ',
        '          --  -     -      ------- -------                     ',
        '         -    -  - -       -    -   -    -                     ',
        '          --     --        -             -                     ',
        '            - ----         -    -   -    -                     ',
        '            -  -           -    -   -    -                     ',
        '            -  -           ------   ------                     ',
        '            ----           -    -   -    -                     ',
        '                           -             -                     ',
        '                           -    -   -    -                     ',
        '                           ------   ------                     ',
        '                           -             -                     ',
        '                           - 1         1 -                     ',
        '                           -             -                     ',
        '                           ---------------                     '
    ];

    const objectSprites = {
        '1': { sprite: 116 }, // Tree
    };

    Object.keys(wallSprites).map(key => wallSprites[key]).forEach(x => x.sprite = getSpritesheetCoordinates(x.sprite));
    Object.keys(wallSprites).map(key => wallSprites[key]).forEach(x => x.darkSprite = getSpritesheetCoordinates(x.darkSprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.sprite = getSpritesheetCoordinates(x.sprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.darkSprite = getSpritesheetCoordinates(x.darkSprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.frameSprite = getSpritesheetCoordinates(x.frameSprite));
    Object.keys(doorSprites).map(key => doorSprites[key]).forEach(x => x.frameDarkSprite = getSpritesheetCoordinates(x.frameDarkSprite));
    Object.keys(objectSprites).map(key => objectSprites[key]).forEach(x => x.sprite = getSpritesheetCoordinates(x.sprite));
    Object.keys(objectSprites).map(key => objectSprites[key]).forEach(x => x.darkSprite = getSpritesheetCoordinates(x.darkSprite));

    return {
        spawn: new Vector(29, 50).add(.5),

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