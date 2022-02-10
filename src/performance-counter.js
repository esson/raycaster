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
     * @param {number} width The width of the widget.
     * @param {number} height The height of the widget.
     */
    draw(ctx, lineColor, textColor, x, y, width, height) {

        const max = this.history.reduce((a, x) => Math.max(a, x), 0);
        const min = this.history.reduce((a, x) => Math.min(a, x), max);
        const diffY = max - min;
        const mid = min + diffY / 2;
        const avg = this.history.reduce((a, x) => a + x, 0) / this.history.length;

        const padding = height * .10;

        // Calculate the width of the left-side labels, then deduce that from the width of the graph.        
        const axisLabelFontSize = height / 8;
        const axisLabelTickWidth = axisLabelFontSize / 2;
        const axisLabelWidth = axisLabelTickWidth * 3 + axisLabelFontSize * 4;

        // The width of the graph is the total width of the widget minus the width of the axis labels.
        const graphWidth = width - axisLabelWidth;

        // Draw the axis labels.
        const axisLabelYStep = height / 2;

        ctx.font = `${axisLabelFontSize}px monospace`;
        ctx.textAlign = 'right';
        ctx.strokeStyle = textColor;

        [max, mid, min].forEach((value, i) => {

            const axisLabelTickX = x + graphWidth;
            const axisLabelTickY = y + axisLabelYStep * i;
            const axisLabelX = x + width;

            ctx.beginPath();
            ctx.moveTo(axisLabelTickX, axisLabelTickY);
            ctx.lineTo(axisLabelTickX + axisLabelTickWidth, axisLabelTickY);
            ctx.stroke();

            ctx.textBaseline = i === 0 ? 'top' : i === 1 ? 'middle' : 'bottom';

            ctx.fillText(`${value.toFixed(2)} MS`, axisLabelX, axisLabelTickY);
        });

        // Draw the frame
        ctx.fillStyle = '#00000099';
        ctx.fillRect(x, y, graphWidth, height)

        ctx.lineWidth = 1;
        ctx.strokeStyle = textColor;
        ctx.strokeRect(x, y, graphWidth, height);

        // Draw the Line Chart
        const graphScaleX = (graphWidth - 2) / this.samples;
        const graphHeight = height - 1;
        const graphLeft = x + 1;
        const graphBottom = y + graphHeight;

        ctx.lineWidth = .5;
        ctx.strokeStyle = lineColor;

        ctx.moveTo(x + 1, y + height - 1);
        ctx.beginPath();

        for (let i = 0; i < this.history.length; i++) {
            ctx.lineTo(graphLeft + graphScaleX * i, graphBottom - (this.history[i] - min) / diffY * graphHeight);
        }

        ctx.stroke();

        // Draw the name
        ctx.font = `${axisLabelFontSize}px monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillStyle = textColor;
        ctx.fillText(this.name.toUpperCase() + ` (${avg.toFixed(2)} MS)`, x + padding, y + padding);
    }

    start() {
        this.lastP = performance.now();
    }

    stop() {
        const delta = performance.now() - this.lastP;

        if (this.history.length === this.samples) {
            this.history.pop();
        }

        this.history.unshift(delta);

        this.min = this.history.length > 1 ? Math.min(this.min, delta) : delta;
        this.max = Math.max(this.max, delta);
    }
}