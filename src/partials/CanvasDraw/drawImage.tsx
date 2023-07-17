// @ts-nocheck
/* eslint-disable no-param-reassign */
/**
 * Original from: https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
 * Original By Ken Fyrstenberg Nilsen
 *
 * Note: img must be fully loaded or have correct width & height set.
 */
 export default function drawImageProp({
    ctx, img, x, y, w, h, offsetX, offsetY,
} = {}) {
    // Defaults
    if (typeof x !== 'number') x = 0;
    if (typeof y !== 'number') y = 0;
    if (typeof w !== 'number') w = ctx.canvas.width;
    if (typeof h !== 'number') h = ctx.canvas.height;
    if (typeof offsetX !== 'number') offsetX = 0.5;
    if (typeof offsetY !== 'number') offsetY = 0.5;

    const imageAspectRatio = img.width / img.height;
    const canvasAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let renderableHeight; let renderableWidth; let xStart; let
        yStart;

    // If image's aspect ratio is less than canvas's we fit on height
    // and place the image centrally along width
    if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = ctx.canvas.height;
        renderableWidth = img.width * (renderableHeight / img.height);
        xStart = (ctx.canvas.width - renderableWidth) / 2;
        yStart = 0;
    // eslint-disable-next-line brace-style
    }

    // If image's aspect ratio is greater than canvas's we fit on width
    // and place the image centrally along height
    else if (imageAspectRatio > canvasAspectRatio) {
        renderableWidth = ctx.canvas.width;
        renderableHeight = img.height * (renderableWidth / img.width);
        xStart = 0;
        yStart = (ctx.canvas.height - renderableHeight) / 2;
    // eslint-disable-next-line brace-style
    }

    // Happy path - keep aspect ratio
    else {
        renderableHeight = ctx.canvas.height;
        renderableWidth = ctx.canvas.width;
        xStart = 0;
        yStart = 0;
    }
    ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    // // keep bounds [0.0, 1.0]
    // if (offsetX < 0) offsetX = 0;
    // if (offsetY < 0) offsetY = 0;
    // if (offsetX > 1) offsetX = 1;
    // if (offsetY > 1) offsetY = 1;

    // const iw = img.width;
    // const ih = img.height;
    // const r = Math.min(w / iw, h / ih);
    // let nw = iw * r; // new prop. width
    // let nh = ih * r; // new prop. height
    // let cx;
    // let cy;
    // let cw;
    // let ch;
    // let ar = 1;

    // // decide which gap to fill
    // // if (Math.round(nw) < w) ar = w / nw;
    // // if (Math.round(nh) < h) ar = h / nh;
    // if (nw < w) ar = w / nw;
    // if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
    // nw *= ar;
    // nh *= ar;

    // // calc source rectangle
    // cw = iw / (nw / w);
    // ch = ih / (nh / h);

    // cx = (iw - cw) * offsetX;
    // cy = (ih - ch) * offsetY;

    // // make sure source rectangle is valid
    // if (cx < 0) cx = 0;
    // if (cy < 0) cy = 0;
    // if (cw > iw) cw = iw;
    // if (ch > ih) ch = ih;

    // // fill image in dest. rectangle
    // ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}
