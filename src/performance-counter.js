export default class PerformanceCounter {

    constructor(name, samples = 1000) {
        this.name = name;
        this.samples = samples;
        this.min = 0;
        this.max = 0;
        this.history = [];
    }

    /**
     * Draws a performance chart widget on the provided context.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} lineColor The chart line color.
     * @param {string} textColor The text color;
     * @param {number} x The x position of the widget.
     * @param {number} y The y position of the widget.
     * @param {number} w The width of the widget.
     * @param {number} h The height of the widget.
     */
    draw(ctx, lineColor, textColor, x, y, w, h) {

        const max = this.getMax();
        const min = this.getMin();
        const mid = min + (max - min) / 2;
        const avg = this.getAverage();

        // Draw the Line Chart
        const wScale = (w - 2) / this.samples;
        const hScale = (h - 2) / max - min;

        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(x + 1, y + h - 1);
        for (let index = 0; index < this.history.length; index++) {
            const ly = this.history[index];
            ctx.lineTo((x + 1) + wScale * index, y + 1 + h - 2 - ly * hScale);
        }

        ctx.stroke();

        // Draw the texts
        const fontSize = h / 6;
        const tickW = 3;

        ctx.strokeStyle = textColor;
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;

        ctx.strokeRect(x, y, w, h);

        ctx.fillText(this.name, x + fontSize / 2, y + fontSize);

        const avgTxt = `Value: ${this.history[0]?.toFixed(2)} ms | Avg: ${avg.toFixed(2)} ms`;
        const avgW = ctx.measureText(avgTxt).width;
        ctx.fillText(avgTxt, x + w - 2 - avgW - fontSize / 4, y + fontSize);

        const yStep = h / 2;

        [max, mid, min].forEach((value, i) => {
            const tx = x + w + 1;
            const ty = y + yStep * i;

            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx + tickW, ty);
            ctx.stroke();

            ctx.textBaseline = i === 0 ? 'top' : i === 1 ? 'middle' : 'bottom';
            ctx.fillText(`${value.toFixed(2)} ms`, tx + tickW + tickW, ty);
        });
    }

    start() {
        this.lastP = performance.now();
    }

    stop() {
        const delta = performance.now() - this.lastP;
        if (this.history.length > this.samples) {
            this.history.pop();
        }
        this.history.unshift(delta);
        this.min = Math.min(this.min, delta);
        this.max = Math.max(this.max, delta);
    }

    getLast() {
        return this.history[0] ?? 0;
    }

    getAverage() {
        return this.history.reduce((acc, x) => acc + x, 0) / this.history.length;
    }

    getMin() {
        return this.min;
        //return this.history.reduce((acc, x) => Math.min(x, acc), this.history[0] ?? 0);
    }

    getMax() {
        return this.max;
        //return this.history.reduce((acc, x) => Math.max(x, acc), 0);
    }
}