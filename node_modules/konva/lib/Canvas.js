import { Util } from "./Util.js";
import { SceneContext, HitContext } from "./Context.js";
import { Konva } from "./Global.js";
let _pixelRatio;
function getDevicePixelRatio() {
    if (_pixelRatio) {
        return _pixelRatio;
    }
    const canvas = Util.createCanvasElement();
    const context = canvas.getContext('2d');
    _pixelRatio = (function () {
        const devicePixelRatio = Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return devicePixelRatio / backingStoreRatio;
    })();
    Util.releaseCanvas(canvas);
    return _pixelRatio;
}
export class Canvas {
    constructor(config) {
        this.pixelRatio = 1;
        this.width = 0;
        this.height = 0;
        this.isCache = false;
        const conf = config || {};
        const pixelRatio = conf.pixelRatio || Konva.pixelRatio || getDevicePixelRatio();
        this.pixelRatio = pixelRatio;
        this._canvas = Util.createCanvasElement();
        this._canvas.style.padding = '0';
        this._canvas.style.margin = '0';
        this._canvas.style.border = '0';
        this._canvas.style.background = 'transparent';
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
    }
    getContext() {
        return this.context;
    }
    getPixelRatio() {
        return this.pixelRatio;
    }
    setPixelRatio(pixelRatio) {
        const previousRatio = this.pixelRatio;
        this.pixelRatio = pixelRatio;
        this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
    }
    setWidth(width) {
        this.width = this._canvas.width = width * this.pixelRatio;
        this._canvas.style.width = width + 'px';
        const pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    }
    setHeight(height) {
        this.height = this._canvas.height = height * this.pixelRatio;
        this._canvas.style.height = height + 'px';
        const pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setSize(width, height) {
        this.setWidth(width || 0);
        this.setHeight(height || 0);
    }
    toDataURL(mimeType, quality) {
        try {
            return this._canvas.toDataURL(mimeType, quality);
        }
        catch (e) {
            try {
                return this._canvas.toDataURL();
            }
            catch (err) {
                Util.error('Unable to get data URL. ' +
                    err.message +
                    ' For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                return '';
            }
        }
    }
}
export class SceneCanvas extends Canvas {
    constructor(config = { width: 0, height: 0, willReadFrequently: false }) {
        super(config);
        this.context = new SceneContext(this, {
            willReadFrequently: config.willReadFrequently,
        });
        this.setSize(config.width, config.height);
    }
}
function isCanvasFarblingActive() {
    const c = Util.createCanvasElement();
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d', {
        willReadFrequently: true,
    });
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = 'rgba(255,0,255,1)';
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    const exact = d[0] === 255 && d[1] === 0 && d[2] === 255 && d[3] === 255;
    return !exact;
}
function isBraveBrowser() {
    var _a, _b;
    if (typeof navigator === 'undefined') {
        return false;
    }
    return (_b = (_a = navigator.brave) === null || _a === void 0 ? void 0 : _a.isBrave()) !== null && _b !== void 0 ? _b : false;
}
let warned = false;
function checkHitCanvasSupport() {
    if (isBraveBrowser() && isCanvasFarblingActive() && !warned) {
        warned = true;
        Util.error('Looks like you have "Brave shield" enabled in your browser. It breaks KonvaJS internals. Please disable it. You may need to ask your users to do the same.');
    }
    return isBraveBrowser() && isCanvasFarblingActive();
}
export class HitCanvas extends Canvas {
    constructor(config = { width: 0, height: 0 }) {
        super(config);
        this.hitCanvas = true;
        this.context = new HitContext(this);
        this.setSize(config.width, config.height);
        checkHitCanvasSupport();
    }
}
