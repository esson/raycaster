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

    const wallSprites = [
        { color: '#797979', darkColor: '#616161', sprite: 0,  darkSprite: 1  }, // Stone Wall
        { color: '#09096f', darkColor: '#070759', sprite: 14, darkSprite: 15 }, // Blue Stone Wall
        { color: '#604220', darkColor: '#4d351a', sprite: 22, darkSprite: 23 }, // Wood Panel Wall
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
        { color: '#00a4a4', darkColor: '#297979', sprite: 98, darkSprite: 99, frameColor: '#00a4a4', frameDarkColor: '#297979', frameSprite: 100, frameDarkSprite: 101, inset: true  }, // Normal Door
        { color: '#000000', darkColor: '#000000', sprite: -1, darkSprite: -1, frameColor: '#00a4a4', frameDarkColor: '#297979', frameSprite: 100, frameDarkSprite: 101, inset: true  }, // Open Normal Door
        { color: '#cccccc', darkColor: '#dddddd', sprite: 24, darkSprite: 25, frameColor: '#cccccc', frameDarkColor: '#dddddd', frameSprite: 100, frameDarkSprite: 101, inset: true }, // Elevator Door
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
        { sprite: 116 }, // Tree
    ];

    wallSprites.forEach(x => x.sprite = getSpriteVector(x.sprite));
    wallSprites.forEach(x => x.darkSprite = getSpriteVector(x.darkSprite));
    wallSprites.unshift(undefined);

    doorSprites.forEach(x => x.sprite = getSpriteVector(x.sprite));
    doorSprites.forEach(x => x.darkSprite = getSpriteVector(x.darkSprite));
    doorSprites.forEach(x => x.frameSprite = getSpriteVector(x.frameSprite));
    doorSprites.forEach(x => x.frameDarkSprite = getSpriteVector(x.frameDarkSprite));
    doorSprites.unshift(undefined);

    objectSprites.forEach(x => x.sprite = getSpriteVector(x.sprite));
    objectSprites.forEach(x => x.darkSprite = getSpriteVector(x.darkSprite));
    objectSprites.unshift(undefined);

    return {
        spawn: new Vector(29, 50).add(.5),

        walls: walls.map(mapLiteralToMapIndex),
        wallsLegend: wallSprites,
        
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

const level_1_1 = createLevel();

export default level_1_1;