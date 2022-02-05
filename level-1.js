const LEVEL_1 = {
    /**
     * @type number[][]
     */
    map: [
        '                            1111111111111                      ',
        '     222222                 1           1                      ',
        '     2    2      222222222221           11111                  ',
        '     2    2      2          1           1   1                  ',
        '     2     2     2                          1                  ',
        '     2     2     2          1           1   1                  ',
        '     22222322222 2   22222221           11111                  ',
        '     2         2 2   2      1           1                      ',
        '     2         222   222     11111 111111                      ',
        '     2         2       2        1   1                          ',
        '     2                 2        1   1                          ',
        '     2         2       2        1   1                          ',
        '222222         222222222        1   1                          ',
        '2   22         2                1   1                          ',
        '2   222222 2222            111111   111                        ',
        '2   2   2   2              1  3       1                        ',
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
        '2                       5 2     4   4               4 4 4 4    ',
        '2                2      222     4   4                          ',
        '2222222222222222223222222       4   4                          ',
        '          22  2  3  2      4444444 4444444                     ',
        '         26   2  2 2       4    4   4    4                     ',
        '          22     22        4             4                     ',
        '            232222         4    4   4    4                     ',
        '            2  2           4    4   4    4                     ',
        '            2  2           444444   444444                     ',
        '            2222           4    4   4    4                     ',
        '                           4 7           4                     ',
        '                           4    4   4    4                     ',
        '                           444444   444444                     ',
        '                           4             4                     ',
        '                           4          8  4                     ',
        '                           4             4                     ',
        '                           444444444444444                     '
    ].map(mapLiteralToMapIndex),
    spriteUrl: 'sprites.png',
    legend: [
        { color: "rgba(0, 0, 0)",      darkColor: "rgba(0, 0, 0)",    sprite: mapIndexToSpritePosition(new Vector(0)),     darkSprite: mapIndexToSpritePosition(new Vector(0)),     wall: false, object: false, npc: false },
        { color: "rgb(96, 66, 32)",    darkColor: "rgb(77, 53, 26)",  sprite: mapIndexToSpritePosition(new Vector(6, 1)),  darkSprite: mapIndexToSpritePosition(new Vector(7, 1)),  wall: true,  object: false, npc: false },
        { color: "rgb(121, 121, 121)", darkColor: "rgb(97, 97, 97)",  sprite: mapIndexToSpritePosition(new Vector(0, 0)),  darkSprite: mapIndexToSpritePosition(new Vector(1, 0)),  wall: true,  object: false, npc: false },
        { color: "rgb(0, 255, 0)",     darkColor: "rgb(0, 204, 0)",   sprite: mapIndexToSpritePosition(new Vector(12, 1)), darkSprite: mapIndexToSpritePosition(new Vector(13, 1)), wall: true,  object: false, npc: false },
        { color: "rgb(9, 9, 111)",     darkColor: "rgb(7, 7, 89)",    sprite: mapIndexToSpritePosition(new Vector(14, 0)), darkSprite: mapIndexToSpritePosition(new Vector(15, 0)), wall: true,  object: false, npc: false },
        { color: "rgb(255, 0, 0)",     darkColor: "rgb(204, 0, 0)",   sprite: mapIndexToSpritePosition(new Vector(8, 1)),  darkSprite: mapIndexToSpritePosition(new Vector(8, 1)),  wall: true,  object: false, npc: false },
        { color: "rgb(255, 255, 0)",   darkColor: "rgb(204, 204, 0)", sprite: mapIndexToSpritePosition(new Vector(3, 7)),  darkSprite: mapIndexToSpritePosition(new Vector(3, 7)),  wall: false, object: true,  npc: false },
        { color: "rgb(0, 0, 186)",     darkColor: "rgb(0, 0, 149)",   sprite: mapIndexToSpritePosition(new Vector(0)),     darkSprite: mapIndexToSpritePosition(new Vector(0)),     wall: true,  object: false, npc: false },
        { color: "rgb(0, 0, 186)",     darkColor: "rgb(0, 0, 149)",   sprite: mapIndexToSpritePosition(new Vector(0, 9)),  darkSprite: mapIndexToSpritePosition(new Vector(0, 9)),  wall: false, object: true,  npc: false }
    ]
};

function mapIndexToSpritePosition(v) {
    return v.multiply(64, 64).add(1 * v.x, 1 * v.y);
}

function mapLiteralToMapIndex(y) {
    return y.split('').map(x => parseInt(x === ' ' ? '0' : x));
}