class RawDataImage {
    constructor(url, width, height) {
        this.url = url;
        this.width = width;
        this.height = height;
    }

    async loadImage() {
        const response = await fetch(this.url);
        const bytes = (await response.body.getReader().read()).value;

        let i = 0;

        const image = [];

        for (let y = 0; y < this.height; y++) {
            image[y] = [];
            for (let x = 0; x < this.width; x++) {
                image[y][x] = [bytes[i], bytes[i + 1], bytes[i + 2]];
                i += 3;
            }
        }

        return this.image = image;
    }

    draw(ctx) {
        const scale = 1;
        const image = this.image;

        for (let y = 0; y < image.length; y++) {
            for (let x = 0; x < image[y].length; x++) {
                ctx.fillStyle = `rgb(${image[y][x][0]}, ${image[y][x][1]}, ${image[y][x][2]})`;
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
}