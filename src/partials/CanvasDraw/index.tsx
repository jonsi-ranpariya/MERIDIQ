// @ts-nocheck
import { Catenary } from "catenary-curve";
import { LazyBrush } from "lazy-brush";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import ResizeObserver from "resize-observer-polyfill";
import drawImage from "./drawImage";

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

const canvasStyle = {
    display: "block",
    position: "absolute"
};

const canvasTypes = [
    {
        name: "interface",
        zIndex: 15
    },
    {
        name: "drawing",
        zIndex: 11
    },
    {
        name: "temp",
        zIndex: 12
    },
    {
        name: "grid",
        zIndex: 10
    }
];

const dimensionsPropTypes = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
]);

const CanvasShape = PropTypes.oneOfType([
    'circle',
    'cross',
    'pen',
    'filled_circle',
    'gradient_circle',
    'text',
]);

export default class CanvasDraw extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        loadTimeOffset: PropTypes.number,
        lazyRadius: PropTypes.number,
        brushRadius: PropTypes.number,
        brushColor: PropTypes.string,
        catenaryColor: PropTypes.string,
        gridColor: PropTypes.string,
        backgroundColor: PropTypes.string,
        hideGrid: PropTypes.bool,
        canvasWidth: dimensionsPropTypes,
        canvasHeight: dimensionsPropTypes,
        disabled: PropTypes.bool,
        imgSrc: PropTypes.string,
        saveData: PropTypes.string,
        immediateLoading: PropTypes.bool,
        hideInterface: PropTypes.bool,
        shape: CanvasShape,
        text: PropTypes.string,
    };

    static defaultProps = {
        onChange: null,
        loadTimeOffset: 5,
        lazyRadius: 12,
        brushRadius: 10,
        brushColor: "#444",
        catenaryColor: "#0a0302",
        gridColor: "rgba(150,150,150,0.17)",
        backgroundColor: "#FFF",
        hideGrid: false,
        canvasWidth: 400,
        canvasHeight: 400,
        disabled: false,
        imgSrc: "",
        saveData: "",
        immediateLoading: false,
        hideInterface: false,
        shape: 'pen',
        text: '',
    };

    constructor(props) {
        super(props);

        this.canvas = {};
        this.ctx = {};

        this.catenary = new Catenary();

        this.points = [];
        this.lines = [];

        this.imageWidth = 0;
        this.imageHeight = 0;

        this.disabled = false;

        this.mouseHasMoved = true;
        this.valuesChanged = true;
        this.isDrawing = false;
        this.isPressing = false;

        this.dirty = false;

        this.shape = this.props.shape ?? 'pen';
        this.text = this.props.text ?? '';
    }

    componentDidMount() {
        this.lazy = new LazyBrush({
            radius: this.props.lazyRadius * window.devicePixelRatio,
            enabled: true,
            initialPoint: {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            }
        });
        this.chainLength = this.props.lazyRadius * window.devicePixelRatio;

        this.canvasObserver = new ResizeObserver((entries, observer) =>
            this.handleCanvasResize(entries, observer)
        );
        this.canvasObserver.observe(this.canvasContainer);

        this.drawImage(false);
        this.loop();

        window.setTimeout(() => {
            const initX = window.innerWidth / 2;
            const initY = window.innerHeight / 2;
            this.lazy.update(
                { x: initX - this.chainLength / 4, y: initY },
                { both: true }
            );
            this.lazy.update(
                { x: initX + this.chainLength / 4, y: initY },
                { both: false }
            );
            this.mouseHasMoved = true;
            this.valuesChanged = true;
            this.clear();

            // Load saveData from prop if it exists
            if (this.props.saveData) {
                this.loadSaveData(this.props.saveData);
            }
        }, 100);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lazyRadius !== this.props.lazyRadius) {
            // Set new lazyRadius values
            this.chainLength = this.props.lazyRadius * window.devicePixelRatio;
            this.lazy.setRadius(this.props.lazyRadius * window.devicePixelRatio);
        }

        if (prevProps.saveData !== this.props.saveData) {
            this.loadSaveData(this.props.saveData);
        }

        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            // Signal this.loop function that values changed
            this.valuesChanged = true;
        }

        if (prevProps.shape !== this.props.shape) {
            this.shape = this.props.shape ?? 'pen';
        }
        if (prevProps.text !== this.props.text) {
            this.text = this.props.text ?? '';
        }
    }

    componentWillUnmount = () => {
        console.log('unmount');
        var children = this?.canvasContainer?.children;
        for (var i = 0; i < children.length; i++) {
            const child = children[i];
            child.height = 0;
            child.width = 0;
            child.style.height = 0;
            child.style.width = 0;
        }
        this.canvasObserver.unobserve(this.canvasContainer);
    };

    isDirty = () => {
        return this.dirty;
    }

    drawImage = (resize = true) => {
        if (!this.props.imgSrc) {
            this.triggerOnChange();
            return;
        }
        this.disabled = true;
        // Load the image
        this.image = new Image();

        // Prevent SecurityError "Tainted canvases may not be exported." #70
        this.image.crossOrigin = "anonymous";
        this.image.AccessControlAllowOrigin = "*";

        // Draw the image once loaded
        this.image.onload = (event) => {
            this.imageHeight = event.target.naturalHeight;
            this.imageWidth = event.target.naturalWidth;

            if (resize) {
                this.handleCanvasResize(this.canvasContainer.childNodes);
            }

            drawImage({ ctx: this.ctx.grid, img: this.image });
            this.disabled = false;

            this.triggerOnChange();
        }
        this.image.src = this.props.imgSrc;
    };

    // https://stackoverflow.com/questions/32160098/change-html-canvas-black-background-to-white-background-when-creating-jpg-image
    canvasToRasterImage = async (canvas, type, backgroundColor) => {
        const context = canvas.getContext('2d');
        // cache height and width
        const w = canvas.width;
        const h = canvas.height;
        let data;
        let compositeOperation;

        if (backgroundColor) {
            // get the current ImageData for the canvas.
            data = context.getImageData(0, 0, w, h);

            context.drawImage(this.canvas.drawing, 0, 0, w, h);
            // store the current globalCompositeOperation
            // eslint-disable-next-line no-var
            compositeOperation = context.globalCompositeOperation;

            // set to draw behind current content
            context.globalCompositeOperation = 'destination-over';

            // set background color
            context.fillStyle = backgroundColor;

            // draw background / rect on entire canvas
            context.fillRect(0, 0, w, h);
        } else {
            context.drawImage(this.canvas.drawing, 0, 0, w, h);
        }

        // context.putImageData(data, 0, 0);
        // context.drawImage(this.canvas.grid, 0, 0);

        // get the image data from the canvas
        // const imageData = await getCanvasBlob(canvas);
        // const imageData = await imageCompression.canvasToFile(canvas, `image/${type}`, `canvasImage.${type}`, 0, 0.2);
        // const imageData = canvas.toDataURL(`image/${type}`, 0.7);
        let imageData = null;
        if (canvas?.toBlob) {
            imageData = await new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        return resolve(blob)
                    }
                    reject("error");
                }, `${type}`, 0.7);
            });
        } else {
            imageData = canvas.toDataURL(`image/${type}`, 0.7);
        }

        if (backgroundColor) {
            // clear the canvas
            context.clearRect(0, 0, w, h);

            // restore it with original / cached ImageData
            context.putImageData(data, 0, 0);

            // reset the globalCompositeOperation to what it was
            // eslint-disable-next-line block-scoped-var
            context.globalCompositeOperation = compositeOperation;
        }

        // return the Base64 encoded data url string
        return imageData;
    }

    undo = () => {
        const lines = this.lines.slice(0, -1);
        this.clear();
        this.simulateDrawingLines({ lines, immediate: true });
        this.triggerOnChange();
    };

    getSaveData = () => {
        // Construct and return the stringified saveData object
        return JSON.stringify({
            lines: this.lines,
            width: this.props.canvasWidth,
            height: this.props.canvasHeight,
        });
    };

    getImageSaveData = async (type = 'jpeg') => {
        if (type === 'png') {
            return await this.canvasToRasterImage(this.canvas.grid, type);
        }
        if (type === 'jpeg') {
            return await this.canvasToRasterImage(this.canvas.grid, type, '#fff');
        }

        return null;
    };

    loadSaveData = (saveData, immediate = this.props.immediateLoading) => {
        if (typeof saveData !== "string") {
            throw new Error("saveData needs to be of type string!");
        }

        const { lines, width, height } = JSON.parse(saveData);

        if (!lines || typeof lines.push !== "function") {
            throw new Error("saveData.lines needs to be an array!");
        }

        this.clear();

        if (
            width === this.props.canvasWidth &&
            height === this.props.canvasHeight
        ) {
            this.simulateDrawingLines({
                lines: lines,
                immediate
            });
        } else {
            // we need to rescale the lines based on saved & current dimensions
            const scaleX = this.props.canvasWidth / width;
            const scaleY = this.props.canvasHeight / height;
            const scaleAvg = (scaleX + scaleY) / 2;

            this.simulateDrawingLines({
                lines: lines.map(line => ({
                    ...line,
                    points: line.points.map(p => ({
                        x: p.x * scaleX,
                        y: p.y * scaleY
                    })),
                    brushRadius: line.brushRadius * scaleAvg,
                    shape: line?.shape ?? 'pen',
                    text: line?.text ?? '',
                })),
                immediate
            });
        }
    };

    simulateDrawingLines = ({ lines, immediate }) => {
        // Simulate live-drawing of the loaded lines
        // TODO use a generator
        let curTime = 0;
        let timeoutGap = immediate ? 0 : this.props.loadTimeOffset;

        lines.forEach(line => {
            const { points, brushColor, brushRadius } = line;

            // Draw all at once if immediate flag is set, instead of using setTimeout
            if (immediate) {
                // Draw the points
                this.drawPoints({
                    points,
                    brushColor,
                    brushRadius,
                    shape: line.shape ?? 'pen',
                    text: line?.text ?? '',
                });

                // Save line with the drawn points
                this.points = points;
                this.saveLine({ brushColor, brushRadius, shape: line.shape ?? 'pen', text: line?.text ?? '', });
                return;
            }

            // Use timeout to draw
            for (let i = 1; i < points.length; i++) {
                curTime += timeoutGap;
                window.setTimeout(() => {
                    this.drawPoints({
                        points: points.slice(0, i + 1),
                        brushColor,
                        brushRadius,
                        shape: line.shape ?? 'pen',
                        text: line?.text ?? '',
                    });
                }, curTime);
            }

            curTime += timeoutGap;
            window.setTimeout(() => {
                // Save this line with its props instead of this.props
                this.points = points;
                this.saveLine({ brushColor, brushRadius, shape: line.shape ?? 'pen', text: line?.text ?? '', });
            }, curTime);
        });
    };

    handleDrawStart = e => {
        e.stopPropagation();

        // Start drawing
        this.isPressing = true;

        const { x, y } = this.getPointerPos(e);

        if (e.touches && e.touches.length > 0) {
            // on touch, set catenary position to touch pos
            this.lazy.update({ x, y }, { both: true });
        }

        // Ensure the initial down position gets added to our line
        this.handlePointerMove(x, y);
    };

    handleDrawMove = e => {
        e.preventDefault();
        e.stopPropagation();

        const { x, y } = this.getPointerPos(e);
        this.handlePointerMove(x, y);
    };

    handleDrawEnd = e => {
        e.stopPropagation();

        // Draw to this end pos
        this.handleDrawMove(e);

        if (this.isDrawing) {
            this.dirty = true;
        }
        // Stop drawing & save the drawn line
        this.isDrawing = false;
        this.isPressing = false;
        this.saveLine();
    };

    handleCanvasResize = (entries, observer) => {
        const saveData = this.getSaveData();
        for (const entry of entries) {

            let width = 0;
            let height = 0;
            let drawImage = true;
            try {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            } catch (error) {
                width = entry.getBoundingClientRect().width;
                height = entry.getBoundingClientRect().height;
                drawImage = false;
            }

            this.setCanvasSize(this.canvas.interface, width, height);
            this.setCanvasSize(this.canvas.drawing, width, height);
            this.setCanvasSize(this.canvas.temp, width, height);
            this.setCanvasSizeGrid(this.canvas.grid, width, height);

            this.drawGrid(this.ctx.grid);
            if (drawImage) {
                this.drawImage(drawImage);
            }
            this.loop({ once: true });
        }
        this.loadSaveData(saveData, true);
    };

    setCanvasSize = (canvas, width, height) => {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width;
        canvas.style.height = height;
    };

    setCanvasSizeGrid = (canvas, width, height) => {
        const expecedWidth = 1620;
        canvas.width = expecedWidth; // 1580
        canvas.height = expecedWidth * (height / width); // 1920

        width = this.canvasContainer.getBoundingClientRect().width;
        height = this.canvasContainer.getBoundingClientRect().height;

        const imageWidth = (this.imageWidth / this.imageHeight) * height;
        const imageHeight = (this.imageHeight / this.imageWidth) * width;

        const canvasStyleWidth = !imageWidth || imageWidth > width ? width : imageWidth;
        const canvasStyleHeight = !imageHeight || imageHeight > height ? height : imageHeight;

        canvas.style.width = `${canvasStyleWidth}px`;
        canvas.style.height = `${canvasStyleHeight}px`;
    };

    getPointerPos = e => {
        const rect = this.canvas.interface.getBoundingClientRect();

        // use cursor pos as default
        let clientX = e.clientX;
        let clientY = e.clientY;

        // const cssScaleX = 1;
        // const cssScaleY = 1;
        // const cssScaleX = this.canvas.temp.width / this.canvas.temp.offsetWidth;
        // const cssScaleY = this.canvas.temp.height / this.canvas.temp.offsetHeight;

        // use first touch if available
        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        }

        // return mouse/touch position inside canvas
        return {
            x: (clientX - rect.left),
            y: (clientY - rect.top),
        };
        // return {
        //     x: (clientX - rect.left) * cssScaleX,
        //     y: (clientY - rect.top) * cssScaleY,
        // };
    };

    handlePointerMove = (x, y) => {
        if (this.props.disabled || this.disabled) return;

        this.lazy.update({ x, y });
        const isDisabled = !this.lazy.isEnabled();

        if (
            (this.isPressing && !this.isDrawing) ||
            (isDisabled && this.isPressing)
        ) {
            // Start drawing and add point
            this.isDrawing = true;
            this.points.push(this.lazy.brush.toObject());
        }

        if (this.isDrawing) {
            // Add new point
            this.points.push(this.lazy.brush.toObject());

            // Draw current points

            this.drawPoints({
                points: this.points,
                brushColor: this.props.brushColor,
                brushRadius: this.props.brushRadius,
                shape: this.shape,
                text: this.text,
            });
        }

        this.mouseHasMoved = true;
    };

    drawPoints = ({ points, brushColor, brushRadius, shape, text }) => {
        this.ctx.temp.lineJoin = "round";
        this.ctx.temp.lineCap = "round";
        this.ctx.temp.strokeStyle = brushColor;

        this.ctx.temp.clearRect(
            0,
            0,
            this.ctx.temp.canvas.width,
            this.ctx.temp.canvas.height
        );
        this.ctx.temp.lineWidth = brushRadius * 2;

        if (shape === 'pen') {

            let p1 = points[0];
            let p2 = points[1];

            this.ctx.temp.moveTo(p2.x, p2.y);
            this.ctx.temp.beginPath();

            for (var i = 1, len = points.length; i < len; i++) {
                // we pick the point between pi+1 & pi+2 as the
                // end point and p1 as our control point
                var midPoint = midPointBtw(p1, p2);
                this.ctx.temp.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                p1 = points[i];
                p2 = points[i + 1];
            }
            // Draw last line as a straight line while
            // we wait for the next point to be able to calculate
            // the bezier control point
            this.ctx.temp.lineTo(p1.x, p1.y);
            this.ctx.temp.stroke();
        }

        if (shape === 'circle') {
            let p1 = points[0];
            let p2 = points[points.length - 1];

            this.ctx.temp.moveTo(p1.x, p1.y);
            this.ctx.temp.beginPath();

            const a = p1.x - p2.x;
            const b = p1.y - p2.y;

            const radius = Math.sqrt(a * a + b * b);

            this.ctx.temp.arc(p1.x, p1.y, radius, 0, 2 * Math.PI, false)
            this.ctx.temp.stroke();
        }

        if (shape === 'filled_circle') {
            this.ctx.temp.fillStyle = brushColor;

            let p1 = points[0];
            let p2 = points[points.length - 1];

            this.ctx.temp.moveTo(p1.x, p1.y);
            this.ctx.temp.beginPath();

            const a = p1.x - p2.x;
            const b = p1.y - p2.y;

            const radius = Math.sqrt(a * a + b * b);

            this.ctx.temp.arc(p1.x, p1.y, radius, 0, 2 * Math.PI, false)
            this.ctx.temp.fill();
        }

        if (shape === 'text') {
            this.ctx.temp.fillStyle = brushColor;

            let p1 = points[0];
            let p2 = points[points.length - 1];

            const a = p1.x - p2.x;
            const b = p1.y - p2.y;

            const fontSize = parseInt(Math.sqrt(a * a + b * b).toString());
            // console.log(fontSize);

            this.ctx.temp.font = `${fontSize}px Inter`;
            this.ctx.temp.fillText(text, p1.x, p1.y);
        }

        if (shape === 'gradient_circle') {
            // Create a linear gradient
            // The start gradient point is at x=20, y=0
            // The end gradient point is at x=220, y=0


            let p1 = points[0];
            let p2 = points[points.length - 1];

            this.ctx.temp.moveTo(p1.x, p1.y);
            this.ctx.temp.beginPath();

            const a = p1.x - p2.x;
            const b = p1.y - p2.y;

            const radius = Math.sqrt(a * a + b * b);

            var gradient = this.ctx.temp.createRadialGradient(
                p1.x,
                p1.y,
                0,
                p1.x,
                p1.y,
                radius,
            );
            // var gradient = this.ctx.temp.createLinearGradient(p1.x - radius, p1.y - radius, radius + p1.x, p1.y + radius);

            // Add three color stops
            gradient.addColorStop(0, brushColor);
            // gradient.addColorStop(0, shadeColor(brushColor, 25));
            // gradient.addColorStop(.5, brushColor);
            gradient.addColorStop(1, brushColor + '00');

            this.ctx.temp.fillStyle = gradient;

            this.ctx.temp.arc(p1.x, p1.y, radius, 0, 2 * Math.PI, false)
            this.ctx.temp.fill();
        }

        if (shape === 'cross') {
            let p1 = points[0];
            let p2 = points[points.length - 1];

            const a = p1.x - p2.x;
            const b = p1.y - p2.y;

            const distance = Math.sqrt(a * a + b * b);

            this.ctx.temp.moveTo(p1.x, p1.y);
            this.ctx.temp.beginPath();

            this.ctx.temp.moveTo(p1.x - distance, p1.y - distance);
            this.ctx.temp.lineTo(p1.x + distance, p1.y + distance);

            this.ctx.temp.moveTo(p1.x + distance, p1.y - distance);
            this.ctx.temp.lineTo(p1.x - distance, p1.y + distance);
            this.ctx.temp.stroke();
        }

    };

    saveLine = ({ brushColor, brushRadius, shape, text } = {}) => {
        if (this.points.length < 2) return;

        // Save as new line
        this.lines.push({
            points: [...this.points],
            brushColor: brushColor || this.props.brushColor,
            brushRadius: brushRadius || this.props.brushRadius,
            shape: shape || this.shape,
            text: text || this.text,
        });

        // Reset points array
        this.points.length = 0;

        const width = this.canvas.temp.width;
        const height = this.canvas.temp.height;

        // Copy the line to the drawing canvas
        this.ctx.drawing.drawImage(this.canvas.temp, 0, 0, width, height);

        // Clear the temporary line-drawing canvas
        this.ctx.temp.clearRect(0, 0, width, height);

        this.triggerOnChange();
    };

    triggerOnChange = () => {
        this.props.onChange && this.props.onChange(this);
    };

    clear = () => {
        this.lines = [];
        this.valuesChanged = true;
        this.ctx.drawing.clearRect(
            0,
            0,
            this.canvas.drawing.width,
            this.canvas.drawing.height
        );
        this.ctx.temp.clearRect(
            0,
            0,
            this.canvas.temp.width,
            this.canvas.temp.height
        );
    };

    delete = () => {
        this.lines = [];
        this.valuesChanged = true;
        this.ctx.drawing.clearRect(
            0,
            0,
            this.canvas.drawing.width,
            this.canvas.drawing.height
        );
        this.ctx.temp.clearRect(
            0,
            0,
            this.canvas.temp.width,
            this.canvas.temp.height
        );
        this.ctx.grid.clearRect(
            0,
            0,
            this.canvas.grid.width,
            this.canvas.grid.height
        );
    };

    loop = ({ once = false } = {}) => {
        if (this.mouseHasMoved || this.valuesChanged) {
            const pointer = this.lazy.getPointerCoordinates();
            const brush = this.lazy.getBrushCoordinates();

            this.drawInterface(this.ctx.interface, pointer, brush);
            this.mouseHasMoved = false;
            this.valuesChanged = false;
        }

        if (!once) {
            window.requestAnimationFrame(() => {
                this.loop();
            });
        }
    };

    drawGrid = ctx => {
        if (this.props.hideGrid) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.beginPath();
        ctx.setLineDash([5, 1]);
        ctx.setLineDash([]);
        ctx.strokeStyle = this.props.gridColor;
        ctx.lineWidth = 0.5;

        const gridSize = 25;

        let countX = 0;
        while (countX < ctx.canvas.width) {
            countX += gridSize;
            ctx.moveTo(countX, 0);
            ctx.lineTo(countX, ctx.canvas.height);
        }
        ctx.stroke();

        let countY = 0;
        while (countY < ctx.canvas.height) {
            countY += gridSize;
            ctx.moveTo(0, countY);
            ctx.lineTo(ctx.canvas.width, countY);
        }
        ctx.stroke();
    };

    drawInterface = (ctx, pointer, brush) => {
        if (this.props.hideInterface) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw brush preview
        ctx.beginPath();
        ctx.fillStyle = this.props.brushColor;
        ctx.arc(brush.x, brush.y, this.props.brushRadius, 0, Math.PI * 2, true);
        ctx.fill();

        // Draw mouse point (the one directly at the cursor)
        ctx.beginPath();
        ctx.fillStyle = this.props.catenaryColor;
        ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2, true);
        ctx.fill();

        // Draw catenary
        if (this.lazy.isEnabled()) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.setLineDash([2, 4]);
            ctx.strokeStyle = this.props.catenaryColor;
            this.catenary.drawToCanvas(
                this.ctx.interface,
                brush,
                pointer,
                this.chainLength
            );
            ctx.stroke();
        }

        // Draw brush point (the one in the middle of the brush preview)
        ctx.beginPath();
        ctx.fillStyle = this.props.catenaryColor;
        ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true);
        ctx.fill();
    };

    ignorePointer = (event) => {
        event.stopPropagation();
        event.preventDefault();
        return;
    }

    render() {
        return (
            <div
                className={this.props.className}
                style={{
                    display: "block",
                    background: this.props.backgroundColor,
                    touchAction: "none",
                    width: this.props.canvasWidth,
                    height: this.props.canvasHeight,
                    ...this.props.style
                }}
                ref={container => {
                    if (container) {
                        this.canvasContainer = container;
                    }
                }}
            >
                {canvasTypes.map(({ name, zIndex }) => {
                    const isInterface = name === "interface";
                    return (
                        <canvas
                            key={name}
                            ref={canvas => {
                                if (canvas) {
                                    this.canvas[name] = canvas;
                                    this.ctx[name] = canvas.getContext("2d");
                                }
                            }}
                            style={{ ...canvasStyle, zIndex }}
                            onMouseDown={isInterface ? this.handleDrawStart : this.ignorePointer}
                            onMouseMove={isInterface ? this.handleDrawMove : this.ignorePointer}
                            onMouseUp={isInterface ? this.handleDrawEnd : this.ignorePointer}
                            onMouseOut={isInterface ? this.handleDrawEnd : this.ignorePointer}
                            onTouchStart={isInterface ? this.handleDrawStart : this.ignorePointer}
                            onTouchMove={isInterface ? this.handleDrawMove : this.ignorePointer}
                            onTouchEnd={isInterface ? this.handleDrawEnd : this.ignorePointer}
                            onTouchCancel={isInterface ? this.handleDrawEnd : this.ignorePointer}
                        />
                    );
                })}
            </div>
        );
    }
}