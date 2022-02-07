import Vector from './vector';

function buildLevel1() {

    const walls = [
        '                            1111111111111                      ',
        '     222222                 1           1                      ',
        '     2    2      222222222221           11111                  ',
        '     2    2      2          1           1   1                  ',
        '     2     2     2                          1                  ',
        '     2     2     2          1           1   1                  ',
        '     22222 22222 2   22222221           11111                  ',
        '     2         2 2   2      1           1                      ',
        '     2         222   222     11111 111111                      ',
        '     2         2       2        1   1                          ',
        '     2                 2        1   1                          ',
        '     2         2       2        1   1                          ',
        '222222         222222222        1   1                          ',
        '2   22         2                1   1                          ',
        '2   222222 2222            111111   111                        ',
        '2   2   2   2              1          1                        ',
        '22 22   2   2              1  111   111                        ',
        '2   22222   2              1  111   1                          ',
        '2   2   2   2              1  111   1                          ',
        '2       2   2              111111   1                          ',
        '2   2   2   2                   1   1                          ',
        '2   222222 22222                11 11                4444444444',
        '2   22         2          222222     2222222         4        4',
        '2   22         2          2               22         4        4',
        '2   22         2          2               244444444444        4',
        '2    2         2          2                4         4        4',
        '2              2          2                                   4',
        '2    2         2          2                4         4        4',
        '2   22         2          2               2444    4444        4',
        '2   22         2          2               22244  4   4        4',
        '2   22         2          222222     222222   4  4   4        4',
        '2   222222 22222               244 44         4  4   444 44 444',
        '2   22222   2                   4   4         4  4      4  4   ',
        '2   22222   2                   4   4         4  4             ',
        '2   2   2   2                   4   4         4  4  4 4 4 4    ',
        '2       2   2                   4   4         4  444 4 4 4 44  ',
        '2   2   2   2                   4   4         4   4         4  ',
        '2   22222   2                   4   4         4             4  ',
        '2   22222   2222222222222       4   4         4   4         4  ',
        '2                2      222     4   4         444444 4 4 4 44  ',
        '2                         2     4   4               4 4 4 4    ',
        '2                2      222     4   4                          ',
        '222222222222222222 222222       4   4                          ',
        '          22  2     2      4444444 4444444                     ',
        '         26   2  2 2       4    4   4    4                     ',
        '          22     22        4             4                     ',
        '            2 2222         4    4   4    4                     ',
        '            2  2           4    4   4    4                     ',
        '            2  2           444444   444444                     ',
        '            2222           4    4   4    4                     ',
        '                           4             4                     ',
        '                           4    4   4    4                     ',
        '                           444444   444444                     ',
        '                           4             4                     ',
        '                           4             4                     ',
        '                           4             4                     ',
        '                           444444444444444                     '
    ];

    const wallSprites = [
        { id: 0, color: 'rgba(0, 0, 0, 0)', darkColor: 'rgba(0, 0, 0, 0)', sprite: -1, darkSprite: -1, fixed: true, wall: false, object: false, npc: false }, // Space
        { id: 1, color: 'rgb(96, 66, 32)', darkColor: 'rgb(77, 53, 26)', sprite: 22, darkSprite: 23, fixed: true, wall: true, object: false, npc: false }, // Wood Panel Wall
        { id: 2, color: 'rgb(121, 121, 121)', darkColor: 'rgb(97, 97, 97)', sprite: 0, darkSprite: 0, fixed: true, wall: true, object: false, npc: false }, // Stone Wall
        { id: 3, color: 'rgb(0, 255, 0)', darkColor: 'rgb(0, 204, 0)', sprite: 98, darkSprite: 99, fixed: false, wall: true, object: false, npc: false }, // Door
        { id: 4, color: 'rgb(9, 9, 111)', darkColor: 'rgb(7, 7, 89)', sprite: 14, darkSprite: 15, fixed: true, wall: true, object: false, npc: false }, // Blue Stone Wall
        { id: 5, color: 'rgb(255, 0, 0)', darkColor: 'rgb(204, 0, 0)', sprite: 24, darkSprite: 25, fixed: true, wall: true, object: false, npc: false }, // Elevator Door
        { id: 6, color: 'rgb(255, 255, 0)', darkColor: 'rgb(204, 204, 0)', sprite: 115, darkSprite: 116, fixed: true, wall: false, object: true, npc: false },
        { id: 7, color: 'rgb(0, 0, 186)', darkColor: 'rgb(0, 0, 149)', sprite: 0, darkSprite: 0, fixed: true, wall: true, object: false, npc: false },
        { id: 8, color: 'rgb(0, 0, 186)', darkColor: 'rgb(0, 0, 149)', sprite: 146, darkSprite: 147, fixed: true, wall: false, object: true, npc: false }, // Well with water
        { id: 9, color: '', darkColor: '', sprite: 100, darkSprite: 101, fixed: true, wall: true, object: false, npc: false }  // Door Frame
    ];

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
        '-                       3 -     -   -               - - - -    ',
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

    const doorSprites = [
        { color: '#00ff00', darkColor: '#00ee00', sprite: 98, darkSprite: 99, frameColor: '#00ff00', frameDarkColor: '#00ee00', frameSprite: 101, frameDarkSprite: 102 },
        { color: '#00a4a4', darkColor: '#297979', sprite: 98, darkSprite: 99, frameColor: '#00a4a4', frameDarkColor: '#297979', frameSprite: 100, frameDarkSprite: 101, inset: true }, // Normal Door
        { color: 'transparent', darkColor: 'transparent', sprite: -1, darkSprite: -1, frameColor: '#00a4a4', frameDarkColor: '#297979', frameSprite: 100, frameDarkSprite: 101, inset: true }, // Open Normal Door
        { color: '#cccccc', darkColor: '#dddddd', sprite: 24, darkSprite: 25, frameColor: '', frameDarkColor: '', frameSprite: -1, frameDarkSprite: -1 }, // Elevator Door
    ];

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
        '                           -  1        1 -                     ',
        '                           -             -                     ',
        '                           ---------------                     '
    ];

    const objectSprites = [
        { sprite: -1 },  // Space
        { sprite: 116 }, // Tree
    ];

    wallSprites.forEach(x => x.sprite = getSpriteVector(x.sprite));
    wallSprites.forEach(x => x.darkSprite = getSpriteVector(x.darkSprite));

    doorSprites.forEach(x => x.sprite = getSpriteVector(x.sprite));
    doorSprites.forEach(x => x.darkSprite = getSpriteVector(x.darkSprite));
    doorSprites.forEach(x => x.frameSprite = getSpriteVector(x.frameSprite));
    doorSprites.forEach(x => x.frameDarkSprite = getSpriteVector(x.frameDarkSprite));

    objectSprites.forEach(x => x.sprite = getSpriteVector(x.sprite));
    objectSprites.forEach(x => x.darkSprite = getSpriteVector(x.darkSprite));

    return {
        /**
         * @type number[][]
         */
        map: walls.map(mapLiteralToMapIndex),
        legend: wallSprites,
        doors: doors.map(mapLiteralToMapIndex),
        doorsLegend: doorSprites,
        objects: objects.map(mapLiteralToMapIndex),
        objectsLegend: objectSprites,
        spriteUrl: 'sprites.png'
    };
}

function mapLiteralToMapIndex(y) {
    return y.split('').map(x => parseInt(x === ' ' || x === '-' ? '0' : x));
}

function getSpriteVector(index, w = 16) {
    return new Vector(index % w, Math.floor(index / w)).multiply(65);
}

const LEVEL_1 = buildLevel1();

export default LEVEL_1;