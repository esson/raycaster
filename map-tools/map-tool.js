function convertImageToMap(image, wallColorMap, wallShadeMap) {
    return image.map(y => y.map(x => {

        // [0, 0, 0] is not a wall
        if (x.every(z => z === 0)) {
            return 0;
        }
        function toRgbString(r, g, b) {
            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        }

        const [r, g, b] = x;
        const rgb = toRgbString(r, g, b);

        let index = wallColorMap.indexOf(rgb);

        if (index > -1) {
            return index;
        }

        index = wallColorMap.length;
        wallColorMap[index] = rgb;
        // Create the shade color
        const [h, s, l] = rgbToHsl(r, g, b);
        const [r2, g2, b2] = hslToRgb(h, s, l * .8);
        const shade = toRgbString(r2, g2, b2);

        wallShadeMap[index] = shade;

        return index;
    }));
}

var levelImage = new RawDataImage('level1.data', 63, 57);

levelImage.loadImage().then((levelData) => {

    const wallColorMap = ['rgba(0, 0, 0, .0)'];
    const wallShadeMap = ['rgba(0, 0, 0, .0)'];

    const map = convertImageToMap(levelData, wallColorMap, wallShadeMap);

    console.log({
        map,
        wallColorMap,
        wallShadeMap
    });

});