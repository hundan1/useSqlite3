/**强制开启动态合图 */
cc.dynamicAtlasManager.enabled = true;
cc.macro.CLEANUP_IMAGE_CACHE = false;

/**@description 对cc.Node 扩展一个临时存储的用户自定义数据 */
if (typeof Reflect == "object") {
    //在浏览器中已经有反射
    Reflect.defineProperty(cc.Node.prototype, "data", {
        value: null,
        writable: true,
    });
} else {
    cc.Node.prototype.data = null;
}

class __BindVal<T>{
    private _n: Symbol = Symbol("unknown");
    private _v: T = undefined;
    constructor(val: T, name?: string) {
        this._v = val;
        this._n = Symbol("name");
    }

    // private get v() {
    //     return this._v
    // }
    // private set v(val) {
    //     // let oldVal = JSON.parse(JSON.stringify(this._v));// null,undefined,function会丢失...
    //     this.watch && this.watch(val, this._v);
    //     this._v = val;
    // }


    public get() {
        return this._v;
    }
    public set(val: T) {
        this.watch && this.watch(val, this._v);
        this._v = val;
    }
    public watch: (newVal?: T, oldVal?: T) => void = null;
}

(window as any).BindVal = __BindVal;

enum IHDTabDirection {
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right",
}

// (window as any).IHDTabDirection = IHDTabDirection;

