const { ccclass, property } = cc._decorator;


let vec2_t1 = new cc.Vec2();
let vec2_t2 = new cc.Vec2();

/**
 * @name hd-tabs
 * @description 选项卡
 * 
 * 
 * 使用到cocos模块:
 *  Sprite、Label、Renderer Texture、Widget、ScrollView、ScrollBar、Graphics、Button、Action、Mask、Layout、Dynamic Atlas
 */

@ccclass
export default class HDTabs extends cc.Component {
    //private tabsPrfb: cc.Prefab = null;
    private headerItemPrfb: cc.Prefab = null;
    private tabsPanePrfb: cc.Prefab = null;
    private _opts: IHDTabsOpts;

    private _current: cc.Node = null;
    private _itemMap: Map<number, cc.Node> = new Map<number, cc.Node>();
    private _paneMap: Map<number, cc.Node> = new Map<number, cc.Node>();

    private _inited = false;


    private tabs_nav_wrap: cc.Node = null;
    private tabs_nav_prev: cc.Node = null;
    private tabs_nav_next: cc.Node = null;
    private tabs_nav_scroll: cc.Node = null;
    private tabs_nav_line: cc.Node = null;
    private tabs_bar_mask_n: cc.Node = null;
    private tabs_bar: cc.Node = null;
    private tabs_nav_view: cc.Node = null;
    private hditemRoot: cc.Node = null;
    private paneRoot: cc.Node = null;

    /**
     * 不需要处理，ScrollView 组件好像
     * 处于正在切换的过程，滚动事件，bar跟随使用； */
    // private _isActiving: boolean = false;

    // 别用_id这个变量
    private _nodeId_ = 0;
    private get _nodeId() {
        let _nodeId_ = this._nodeId_;
        this._nodeId_++;
        return _nodeId_;
    }
    private set _nodeId(val) {

    }

    /** @description 双击事件判断用 */
    private _dbClkArr: number[] = [];
    private _dbClkTarget: cc.Node = null;

    /** 这样写不好，换成事件cc.Node.EventType.SIBLING_ORDER_CHANGED */
    // private _getOrderedPos: number = 0;

    /** ----Function start ---- */
    /**
     * @description 初始化数据
     * 
     * @example
     * ```js
     * import HDTabs from '../comps/hd-tabs/HDTabs';
     * 
     * 
     * public viewRoot: cc.Node = null;
     * public tabsPrfb: cc.Prefab = null;
     * public currTab: BindVal<string> = null;
     * public tabPanes: IHDTabPaneOpts[] = [];
     * 
     * onLoad() {
     *     this.currTab = new BindVal<string>("test3", "value");
     *     // this.currTab = new BindVal<string>("未知的name", "value");
     *     // this.currTab = undefined; // 未定义时，默认为第一个
     *     // this.currTab = null; // null时，默认为第一个
     *     this.tabPanes = [];
     *     Array(10).fill(0).forEach((el, index) => {
     *         this.tabPanes[this.tabPanes.length] =
     *         {
     *             label: "测试" + index,
     *             name: "test" + index,
     *             closable: true,
     *             render: null,
     *         };
     *     });
     *     cc.log("tabPanes:", this.tabPanes);
     * }
     * start() {
     *     this.viewRoot = cc.find("Canvas/ViewRoot");
     *     this.tabsPrfb = cc.find("Canvas/prefabs/hd-tabs") as any;
     * 
     *     this.testHDTabs();
     * }
     * 
     * testHDTabs() {
     *     if (!this.viewRoot) {
     *         cc.warn("场景中viewRoot节点不存在");
     *         return;
     *     }
     *     if (!this.tabsPrfb) {
     *         cc.warn("场景中prefabs/hd-tabs节点不存在");
     *         return;
     *     }
     *     
     *     
     *     let tabsNode = cc.instantiate(this.tabsPrfb);
     *     tabsNode.parent = this.viewRoot;
     *     tabsNode.active = true;
     *     tabsNode.setPosition(cc.Vec3.ZERO);
     *     
     *     let tabsNode_s = tabsNode.addComponent(HDTabs);
     *     tabsNode_s.init({
     *         rPanes: this.tabPanes,
     *         value: this.currTab,
     *         onTabRemove: (name) => {
     *             this.tabPanes.forEach((pane, index) => {
     *                 if (pane.name == name) {
     *                     // cc.log("remove pane:", pane);
     *                     this.tabPanes.splice(index, 1);
     *                     tabsNode_s.remove(name);
     *     
     *                     if (this.tabPanes.length > 0) {
     *     
     *                         // 删除的是最后一个
     *                         if (this.tabPanes.length == index ) {
     *                             // 显示删完后的最后一个
     *                             let currTab = this.tabPanes[index - 1];
     *                             this.currTab.set(currTab.name);
     *                         } else {
     *                             // 显示被删除的下一个
     *                             let currTab = this.tabPanes[index];
     *                             this.currTab.set(currTab.name);
     *                         }
     *                     }
     *                 }
     *             });
     *         }
     *     });
     *     
     * }
     * ```
     * 
     * */
    public init({
        rPanes = [],/**@description 选项卡面板渲染信息*/
        styles = {
            width: 300,
            height: 300,
            header: {
                width: "100%",
                height: 40,
                margin: {
                    bottom: 20,
                },
                prev: {
                    width: 16,
                    height: 40,
                },
                next: {
                    width: 16,
                    height: 40,
                },
                item: {
                    width: 100,
                    height: 40,
                    spacingX: 10,
                    spacingY: 10,
                    padding: {
                        top: 0,
                        bottom: 0,
                        left: 20,
                        right: 20,
                    },
                    bgColor: new cc.Color(188, 188, 188, 255),
                },
                label: {
                    fontSize: 16,
                    lineHeight: 28,
                    color: cc.Color.WHITE,
                    bgColor: new cc.Color(188, 188, 188, 255),
                },
                line: {
                    color: new cc.Color(62, 62, 62, 255),
                    width: undefined,
                    height: 2,
                },
                bar: {
                    color: new cc.Color(49, 236, 255, 255),
                    width: undefined,
                    height: 2,
                }
            },
            activeHeader: {
                item: {
                    bgColor: new cc.Color(255, 128, 0, 255),
                },
                label: {
                    color: cc.Color.BLACK,
                }
            },
        },

        value,
        type = "default",
        closable = false,
        addable = false,
        editable = false,
        tabPosition = "top",
        beforeLeave = null,

        /**events start */
        onTabClick = null,
        onTabRemove = null,
        onTabAdd = null,
        onTabEdit = null,
        /**events end */
    }
        : IHDTabsOpts) {


        // 获取场景中的预制
        // this.treePrfb = cc.find("Canvas/prefabs/hd-tree") as any;
        this.headerItemPrfb = cc.find("Canvas/prefabs/hd-tabs-hd-item") as any;
        this.tabsPanePrfb = cc.find("Canvas/prefabs/hd-tabs-pane") as any;

        if (!this.headerItemPrfb) {
            cc.warn("未找到场景中prefabs节点下的预制 hd-tabs-hd-item");
            return;
        }
        if (!this.tabsPanePrfb) {
            cc.warn("未找到场景中prefabs节点下的预制 hd-tabs-pane");
            return;
        }

        // if (rPanes.length) {
        // 支持[]
        this._setOpts({
            rPanes, styles,
            value, type, closable, addable, editable, tabPosition, beforeLeave,
        /**events start */onTabClick, onTabRemove, onTabAdd, onTabEdit,
            /**events end */
        });

        /**init get node start*/
        this.tabs_nav_wrap = cc.find("tabs__header/tabs__nav-wrap", this.node);

        this.tabs_nav_prev = cc.find("tabs__nav-prev", this.tabs_nav_wrap);
        this.tabs_nav_next = cc.find("tabs__nav-next", this.tabs_nav_wrap);
        this.tabs_nav_scroll = cc.find("tabs__nav-scroll", this.tabs_nav_wrap);
        this.tabs_nav_line = cc.find("tabs__nav-line", this.tabs_nav_wrap);
        this.tabs_bar_mask_n = cc.find("tabs__active-bar-mask", this.tabs_nav_wrap);

        this.tabs_bar = cc.find("tabs__active-bar", this.tabs_bar_mask_n);


        this.tabs_nav_view = cc.find("view", this.tabs_nav_scroll);
        this.hditemRoot = cc.find("view/tabs__nav", this.tabs_nav_scroll);

        this.paneRoot = cc.find("tabs__content", this.node);
        /**init get node end*/

        this.generateNode(this._opts.rPanes);
        // }
    }

    /**
     * @description 通过name移除tab，最好保证name唯一，否则可能误移除。！！！注意：记得修改value值，用set方法改值！！！
     * @param {string} name 
     * */
    public remove(name: string) {
        if (!this._inited) {
            cc.warn("请先调用init()");
            return;
        }
        let item = this.findItem(name);
        if (item) {
            // 【待修改】，需要先判断closable

            // 【待优化，data没有ts提示】从map中移除
            this._paneMap.delete(item.data.pane.data.nodeId);
            this._itemMap.delete(item.data.nodeId);

            item.data.pane.destroy();
            item.destroy();

            let tabs_nav_wrap = cc.find("tabs__header/tabs__nav-wrap", this.node);
            let tabs_nav_scroll = cc.find("tabs__nav-scroll", tabs_nav_wrap);
            let hditemRoot = cc.find("view/tabs__nav", tabs_nav_scroll);
            hditemRoot.getComponent(cc.Layout).updateLayout();


            /**控制翻页按钮显隐 */
            this.controlPageDownBtnShow();

            // 由于tabs__nav身上有Layout组件,resizeMode为 container；并且它作为scrollview 的content ;如果使用widget会有问题，手动设置position
            this.hditemRoot.setPosition((this.hditemRoot.width - this.tabs_nav_view.width) / 2, 0, 0);

            if (this._current) {
                if (this._current.data.data.name == name) {
                    this._current = null;
                    this.hideBar();
                } else {
                    // 删除非当前的，layout变化，原来label前移动，bar要相对跟随
                    this.barMove(this._current, true);
                }
            }
        } else {
            cc.warn("无效的name:", name);
        }
    }

    /**
     * 
     * @description 指定位置添加单个或多个tab,
     * @param {IHDTabPaneOpts | IHDTabPaneOpts[]} data 添加的信息，可以是数组
     * @param {number} [posIndex] 添加时，插入位置，默认末尾添加 即 当前的tabs数量
     * */
    public add(data: IHDTabPaneOpts | IHDTabPaneOpts[], posIndex: number = this._itemMap.size) {
        if (!this._inited) {
            cc.warn("请先调用init()");
            return;
        }
        if (posIndex > this._itemMap.size || posIndex < 0) {
            cc.warn(`posIndex参数异常，取值范围:0 ~ ${this._itemMap.size}`);
            return;
        }

        let rPanes: IHDTabPaneOpts[] = null;
        if (Array.isArray(data)) {
            if (data.length == 0) {
                cc.warn("传数组时不能为[]");
                return;
            }
            rPanes = data.map(el => el);
        } else {
            rPanes = [data];
        }

        this.generateNode(rPanes, false, posIndex);
    }

    /**
     * @description 修改信息,通过data中的name去查询修改
     * @param {IHDTabPaneOpts } data 修改的信息，
     */
    public edit(data: IHDTabPaneOpts) {
        if (!this._inited) {
            cc.warn("请先调用init()");
            return;
        }
        let item = this.findItem(data.name);
        if (item) {
            /**header */
            let hditemLabel = cc.find("label", item);
            hditemLabel.getComponent(cc.Label).string = data.label;

            /**pane */
            if (data.render) {
                let node = data.render();
                node.parent = item.data.pane;
                node.active = true;
            }

        } else {
            cc.warn("无效的name:", data.name);
        }
    }

    /** ----Function end ---- */

    /** ----Events start ---- */

    /** ----Events end ---- */


    /**
     * 【待完善】配置参数信息
     * @param options 
     */
    private _setOpts(options: IHDTabsOpts) {

        if (options.value instanceof BindVal) {
            if (options.rPanes.every(el => el.name !== options.value.get())) {
                cc.warn("无效的value:", options.value.get());
            }

        } else if (options.value === undefined || options.value === null) {

            if (options.rPanes.length == 0) {
                cc.log("value为undefined或null，rPanes为[]，value默认为BindVal<string>(null,\"value\")");
                options.value = new BindVal<string>(null, "value");
            } else {
                cc.log("value为undefined或null，value默认为第一个name。");
                let fst_name = options.rPanes[0].name;
                options.value = new BindVal<string>(fst_name, "value");
            }
            cc.warn("请设置value值。");
        }



        // cc.log("onNodeClick: ", options.onNodeClick);
        // this._opts = JSON.parse(JSON.stringify(options));
        this._opts = options;
        // cc.log("_opts.onNodeClick: ", this._opts.onNodeClick);// JSON.parse(JSON.stringify(options)) 会把函数搞没了

        this._opts.value.watch = (newVal, oldVal) => {
            // 【修改】name支持null|undefined
            cc.log("newVal: ", newVal);
            let item = this.findItem(newVal);
            cc.log("change to item: ", item);
            if (item) {
                this.changeItem(item);
            } else {
                if (this._current) {
                    this.setActiveStyle(this._current, false);
                    this.hideBar();
                    this._current = null;
                }
                cc.warn("无效的value:", newVal);
            }
        };
    }

    /**
     * 生成节点，初始化，添加用
     * @param {IHDTabPaneOpts[]} rPanes 生成item和pane的数据
     * @param {boolean} [isInit = true] 是否是初始化,默认值为true
     * @param {number} [posIndex] 添加时，插入位置，默认末尾添加 即 当前的tabs数量
     */
    private generateNode(rPanes: IHDTabPaneOpts[], isInit: boolean = true, posIndex: number = this._itemMap.size) {
        // 不能直接this._current = null;
        let _current = null;

        if (this._current) {
            cc.log("添加tab前 _current 的位置: ", JSON.parse(JSON.stringify(this._current.position)), this._current.data.data.label);
        }


        /**
         * 【待修改】是否得修改this._opts.rPanes？
         */

        if (isInit) {
            this._inited = false;

            this._current = null;
            this._itemMap.clear();
            this._paneMap.clear();
            this.hideBar();
            this.hditemRoot.removeAllChildren();
            // this.hditemRoot.children.forEach(childNode => {
            //     // cc.log(childNode);
            //     if (childNode.name !== "tabs__active-bar-mirror") {
            //         childNode.destroy();
            //     }
            // });

            this.paneRoot.removeAllChildren();

            this.tabs_nav_next.off(cc.Node.EventType.TOUCH_END);
            this.tabs_nav_prev.off(cc.Node.EventType.TOUCH_END);
            // cc.ScrollView.EventType.SCROLLING
            this.tabs_nav_scroll.off("scrolling");

            this.tabs_nav_next.on(cc.Node.EventType.TOUCH_END, this.onNextClicked, this);
            this.tabs_nav_prev.on(cc.Node.EventType.TOUCH_END, this.onPrevClicked, this);
            // cc.ScrollView.EventType.SCROLLING
            this.tabs_nav_scroll.on("scrolling", this.onScrolling, this);
        } else {

            /**单纯子节点排序还是用siblingIndex好，不然移除后再添加可能有问题 */
            /*
            if (posIndex < this._itemMap.size) {
                // 非末尾添加，需要调整部分子节点zIndex
                for (let i = posIndex; i < this._itemMap.size; i++) {
                    this.hditemRoot.children[i].zIndex = i + rPanes.length;
                    this.paneRoot.children[i].zIndex = i + rPanes.length;
                }
            }
            */
        }


        let { header: headerStyles } = this._opts.styles;



        rPanes.forEach((item, index) => {
            /**header start */

            let hditem = cc.instantiate(this.headerItemPrfb);

            let _data = JSON.parse(JSON.stringify(item));
            let isActive = this._opts.value.get() === _data.name;

            // JSON stringify parse 会把null，undefined,function。。。 干没了
            // 【修改】name支持null|undefined
            // if (!item.name) {
            //     cc.warn("无效的name,pane:", _data);
            // }

            // cc.log(_data);
            hditem.name = "hd-tabs-hd-item";
            hditem.parent = this.hditemRoot;
            if (isInit) {
                // hditem.zIndex = index;
            } else {
                // hditem.zIndex = posIndex + index;
                // this.hditemRoot.addChild posIndex
                hditem.setSiblingIndex(posIndex + index);
            }

            let _nodeId = this._nodeId;
            hditem.data = {
                /** 【待修改】存储用户自定义数据 */
                data: _data,
                nodeId: _nodeId
                /** 存储该pane信息 */
                // pane: { ...item }
            };
            this._itemMap.set(_nodeId, hditem);
            // delete hditem.data.pane.data;

            // hditem.on(cc.Node.EventType.TOUCH_END, this.clickItem, this);

            hditem.on(cc.Node.EventType.TOUCH_START, this.itemTouchStart, this);
            hditem.on(cc.Node.EventType.TOUCH_END, this.itemTouchEnd, this);

            let hditemLabel = cc.find("label", hditem);
            hditemLabel.getComponent(cc.Label).string = item.label;

            /**
             * h5有z-index属性，可以改变bar节点的层级，即使line是后渲染的。
             * cc中我的解决方法是 真实bar放在line相邻的下一个节点位。scrolling事件中改变bar的位置。
             * bar坐标计算通过item下的bar-refer节点
             * 
             * 【淦】写完我才发现，Node也有z-index的概念,_localZOrder,通过addChild()第二个参数，可以设置渲染优先级。别跟zIndex搞混了，zIndex 是指该节点在父节点上的顺序，大的在前，相同的先添加的在前。不过放在Layout里面要解决一个问题，spacingX会影响，即使把它宽高设置为0。
             * 
             * hditemBarRefer： bar附着参考节点，坐标转换用 
             * */
            let hditemBarRefer = cc.find("bar-refer", hditem);
            this.setHditemBarReferPos(hditemBarRefer, hditem);
            // hditemBarRefer.setPosition(0, (headerStyles.bar.height - hditem.height) / 2, 0);
            // cc.log("hditemBarRefer positon:", JSON.parse(JSON.stringify(hditemBarRefer.position)));

            let hditemClose = cc.find("icon-close", hditem);

            hditem.active = true;

            if (!isActive) {
            } else {
                // 样式在layout重新布局后，调用changeItem里面切换
                // let { activeHeader } = this._opts.styles;
                // let hditemBg = cc.find("bg", hditem);
                // hditemBg.color = activeHeader.item.bgColor;
                // hditemLabel.color = activeHeader.label.color;

                // 在 hditemRoot位置、layout重新布局之后再搞
                // this.barMove(hditem);
            }



            hditemClose.on(cc.Node.EventType.TOUCH_END, this.onCloseClicked, this);

            /**header end */

            /**pane start */
            let pane = cc.instantiate(this.tabsPanePrfb);
            pane.name = "hd-tabs-pane";
            pane.parent = this.paneRoot;
            if (isInit) {
                // pane.zIndex = index;
            } else {

                pane.setSiblingIndex(posIndex + index);
                // pane.zIndex = posIndex + index;
                // this.hditemRoot.addChild posIndex
            }
            _nodeId = this._nodeId;
            pane.data = {
                /** 存储用户自定义数据 */
                data: _data,
                nodeId: _nodeId
                /** 存储该pane信息 */
                // pane: { ...item }
            };
            this._paneMap.set(_nodeId, pane);
            pane.active = true;

            // cc.log(this._opts.value.get(), _data.name);
            if (!isActive) {
                pane.opacity = 0;//隐藏
            } else {
                _current = hditem;
            }

            hditem.data.pane = pane;
            pane.data.item = hditem;

            if (item.render) {
                let node = item.render();
                node.parent = pane;
                node.active = true;
            } else {
                let label_n = new cc.Node();
                label_n.name = "hd-tabs-pane";
                let lbl = label_n.addComponent(cc.Label);
                lbl.string = item.label;
                lbl.cacheMode = cc.Label.CacheMode.BITMAP;

                label_n.parent = pane;
                label_n.active = true;
            }
            /**pane end */
        });


        /**header start */

        // let hditemRoot_size = hditemRoot.getContentSize();
        // let tabs_nav_view_size = tabs_nav_view.getContentSize();
        // let tabs_nav_wrap_size = tabs_nav_wrap.getContentSize();
        // cc.log("hditemRoot:", hditemRoot);
        // cc.log("tabs_nav_view:", tabs_nav_view);
        // cc.log("tabs_nav_wrap:", tabs_nav_wrap);
        // cc.log("tabs_nav_scroll:", tabs_nav_scroll);

        /**立即更新Layout 计算出hditemRoot尺寸 */
        this.hditemRoot.getComponent(cc.Layout).updateLayout();

        /**控制翻页按钮显隐 */
        this.controlPageDownBtnShow();

        // 由于tabs__nav身上有Layout组件,resizeMode为 container；并且它作为scrollview 的content ;如果使用widget会有问题，手动设置position
        this.hditemRoot.setPosition((this.hditemRoot.width - this.tabs_nav_view.width) / 2, 0, 0);


        if (isInit) {
            // 初始value值为无效的name时，未选中状态
            if (_current) {
                this.changeItem(_current);

                // 这两个方法 changeItem里面会调用
                // this.showBar();
                // this.barMove(_current);
            }

            this._inited = true;
        } else {
            if (_current) {
                // 这种情况发生在，先修改value值<值为待添加中的某一个name>，造成未选中状态,添加的时候查到它了
                cc.log("添加前设置value");
                this.changeItem(_current);
            } else if (this._current) {


                // cc.log("当前有已选中:", this._current);
                cc.log("添加tab后 _current 的位置: ", JSON.parse(JSON.stringify(this._current.position)), this._current.data.data.label);

                // ？？取的坐标有问题 子节点排序是延后排序的
                /** 这样写不好，换成事件cc.Node.EventType.SIBLING_ORDER_CHANGED */
                // this._getOrderedPos = 3;

                /*这个取的有问题*/
                // this._current.parent.on(cc.Node.EventType.CHILD_REORDER, () => {
                // this._getOrderedPos = 2;
                // cc.log("排序完成");
                // cc.log("lateUpdate中 _current 的位置: ", JSON.parse(JSON.stringify(this._current.position)), this._current.data.data.label);
                // 此时，在下一帧 cc.Director.EVENT_AFTER_UPDATE 事件后，即 cc.Director.EVENT_BEFORE_DRAW 事件及以后可以拿
                // }, this);

                let cb = () => {
                    let offset = this.autoAdjustItemPos(this._current);
                    this.barMove(this._current, true, offset);
                    this._current.off(cc.Node.EventType.SIBLING_ORDER_CHANGED, cb, this);
                };
                this._current.on(cc.Node.EventType.SIBLING_ORDER_CHANGED, cb, this);



            }
        }


        /**header end */
    }

    /**
     * @description 控制翻页按钮显隐,并调整Scroll宽高!!!注意确保在 hditemRoot cc.Layout组件 updateLayout() 后调用；并且保证 this._itemMap 值正确
     */
    private controlPageDownBtnShow() {
        // cc.log(this.hditemRoot.width, this.tabs_nav_wrap.width);
        if (this._itemMap.size == 0) {
            this.hditemRoot.width = 0;
            this.hditemRoot.height = 0;
        }

        if (this.hditemRoot.width > this.tabs_nav_wrap.width) {
            // 改变scroll 大小,控制按钮显式
            let tabs_nav_scrollWgt = this.tabs_nav_scroll.getComponent(cc.Widget);
            if (tabs_nav_scrollWgt) {
                // cc.log("更改wgt");
                tabs_nav_scrollWgt.left = this.tabs_nav_prev.width;
                tabs_nav_scrollWgt.right = this.tabs_nav_next.width;
                tabs_nav_scrollWgt.updateAlignment();
                this.tabs_nav_view.getComponent(cc.Widget).updateAlignment();

                this.tabs_nav_prev.active = true;
                this.tabs_nav_next.active = true;
            }
        } else {
            let tabs_nav_scrollWgt = this.tabs_nav_scroll.getComponent(cc.Widget);
            if (tabs_nav_scrollWgt) {
                // cc.log("更改wgt");
                tabs_nav_scrollWgt.left = 0;
                tabs_nav_scrollWgt.right = 0;
                tabs_nav_scrollWgt.updateAlignment();
                this.tabs_nav_view.getComponent(cc.Widget).updateAlignment();

                this.tabs_nav_prev.active = false;
                this.tabs_nav_next.active = false;
            }
        }
    }

    /**
     * 通过name拿 item ,没有返回null
     * @param {string} name
     */
    private findItem(name: string) {
        let res = null;
        let iter = this._itemMap.entries();
        for (let i = 0; i < this._itemMap.size; i++) {
            let [key, _item] = iter.next().value;
            if (_item.data.data.name === name) {
                res = _item;
                break;
            }
        }
        return res;
    }

    /** 
     * 设置该参考节点位置，自动调整时，得加上offset
    */
    private setHditemBarReferPos(hditemBarRefer: cc.Node, item: cc.Node, offset: cc.Vec2 = cc.v2(0, 0)) {
        let { header: headerStyles } = this._opts.styles;

        hditemBarRefer.setPosition(0 + offset.x, (headerStyles.bar.height - item.height) / 2 + offset.y, 0);
    }

    /**
     * 单击item(label)
     */
    // private clickItem(event: cc.Event.EventTouch) {
    private sigleClickItem(event: cc.Event.EventTouch) {
        // cc.log("event.target:", event.target);
        let item = event.target as cc.Node;
        this._opts.onTabClick && this._opts.onTabClick(item.data, event);
        this.changeItem(item);
    }

    /**
     * 双击item关闭 tab
     * @param event 
     */
    private doubleClickItem(event: cc.Event.EventTouch) {
        cc.log("event.target:", event.target);
        let item = event.target;
        this._opts.onTabRemove && this._opts.onTabRemove(item.data.data.name);
        // this.close(item); // 由用户控制，切换、移除，逻辑
    }

    /**
     * @description item触摸开始事件
     * @param event 
     */
    private itemTouchStart(event: cc.Event.EventTouch) {
        // cc.log("itemTouchStart...");

        var testDate = new Date();
        var time = testDate.getTime();//获取当前时间的毫秒数
        if ((this._dbClkArr.length > 0 && (time - this._dbClkArr[0]) / 1000 > 1) || (this._dbClkTarget && this._dbClkTarget.uuid !== event.target.uuid)) {
            this._dbClkArr = [];//1秒内未连续点击或双击的不是同一个（多个node使用同一个事件函数）
            // cc.log("两次时间间隔大于1秒 清空时间数组");
        }
        this._dbClkArr.push(time);
        this._dbClkTarget = event.target;
    }

    /**
     * @description item触摸开始事件
     * @param event 
     */
    private itemTouchEnd(event: cc.Event.EventTouch) {
        // cc.log("itemTouchEnd...");
        if (this._dbClkArr.length == 2) {//检测双击
            //此处可添加需要执行的操作
            // cc.log("双击操作");
            this.doubleClickItem(event);

            this._dbClkArr = [];
        } else if (this._dbClkArr.length == 1) {
            this.sigleClickItem(event);
            // cc.log("单击操作");
        }
    }

    /**
     * 【待修改，得跟barMove|autoAdjustItemPos|showBar他们解耦】切换item
     * @param item 
     */
    private changeItem(item: cc.Node) {
        let { data: { nodeId } } = item as cc.Node;

        /**header */
        let offset = this.autoAdjustItemPos(item);


        if (this._current) {
            if (this._current.data.nodeId == nodeId) {
                return;
            } else {
                /**header */
                this.setActiveStyle(this._current, false);
                this.barMove(item, true, offset);
            }
        } else {
            /**header */
            this.showBar();
            this.barMove(item);
        }




        // this._isActiving = true;
        this.setActiveStyle(item, true);


        this._current = item;
    }

    /**
     * 设置active样式
     * @param {cc.Node} item item节点
     * @param {boolean} isActive 是否选中
     */
    private setActiveStyle(item: cc.Node, isActive: boolean) {
        if (isActive) {
            /**header */
            let { activeHeader } = this._opts.styles;
            let hditemBg = cc.find("bg", item);
            let hditemLabel = cc.find("label", item);
            hditemBg.color = activeHeader.item.bgColor;
            hditemLabel.color = activeHeader.label.color;

            /**pane */
            item.data.pane.opacity = 255;

        } else {
            /**header */
            let { header } = this._opts.styles;
            let hditemBg = cc.find("bg", item);
            let hditemLabel = cc.find("label", item);
            hditemBg.color = header.item.bgColor;
            hditemLabel.color = header.label.color;


            /**pane */
            item.data.pane.opacity = 0;
        }

    }

    private onNextClicked(event: cc.Event.EventTouch) {
        cc.log("event.target:", event.target);
        this.nextPage();
    }
    private onPrevClicked(event: cc.Event.EventTouch) {
        cc.log("event.target:", event.target);
        this.prevPage();
    }
    private onCloseClicked(event: cc.Event.EventTouch) {
        cc.log("event.target:", event.target);
        let item = event.target.parent;
        this._opts.onTabRemove && this._opts.onTabRemove(item.data.data.name);
        // this.close(item); // 由用户控制，切换、移除，逻辑
    }
    /**
     * 调整item位置
     *    点击item时，判断item在view是否显示全，不全左移<滚动>或右移<滚动>
     *    改变value值时，也调整
     * @param {cc.Node} item 点击的item
     */
    private autoAdjustItemPos(item: cc.Node): cc.Vec2 {
        const SCROLL_INTERVAL = 0.3;


        let _offset = cc.v2(0, 0);
        // let tabs_nav_scroll = cc.find("tabs__header/tabs__nav-wrap/tabs__nav-scroll", this.node);
        // let tabs_nav_view = cc.find("view", tabs_nav_scroll);
        let worldPos = item.convertToWorldSpaceAR(cc.v2(0, 0));
        let item_n_pos = this.tabs_nav_view.convertToNodeSpaceAR(worldPos);
        cc.log("item的世界坐标:", JSON.parse(JSON.stringify(worldPos)));
        cc.log("view节点下坐标: ", JSON.parse(JSON.stringify(item_n_pos)));

        // 待改，需要考虑item比view大时
        let itemSize = item.getContentSize();
        let viewSize = this.tabs_nav_view.getContentSize();
        if (item_n_pos.x < (itemSize.width - viewSize.width) / 2) {
            // 靠左开头处显示不全，需要右移动到开头
            cc.log("靠左开头处显示不全，需要右移动到开头");
            let scroll = this.tabs_nav_scroll.getComponent(cc.ScrollView);

            let currOffset = scroll.getScrollOffset();
            cc.log("currOffset: ", JSON.parse(JSON.stringify(currOffset)));

            // 向右滚动取负值
            // _offset.x = -(Math.abs(item_n_pos.x) + (itemSize.width / 2) - (viewSize.width / 2));
            // 合并-/运算
            _offset.x = -(Math.abs(item_n_pos.x) + ((itemSize.width - viewSize.width) / 2));
            _offset.y = 0;

            // vec2_t1.x = Math.abs(currOffset.x) - (Math.abs(item_n_pos.x) - (viewSize.width - itemSize.width) / 2);
            vec2_t1.x = Math.abs(currOffset.x) + _offset.x;
            vec2_t1.y = 0;
            let offset = vec2_t1;
            cc.log("offset: ", JSON.parse(JSON.stringify(offset)));
            scroll.scrollToOffset(offset, SCROLL_INTERVAL);

        } else if (item_n_pos.x > (viewSize.width - itemSize.width) / 2) {

            // 靠右末尾处显示不全，需要左移动到末尾
            cc.log("靠右末尾处显示不全，需要左移动到末尾");
            let scroll = this.tabs_nav_scroll.getComponent(cc.ScrollView);

            let currOffset = scroll.getScrollOffset();
            cc.log("currOffset: ", JSON.parse(JSON.stringify(currOffset)));

            // 向左滚动取正值
            _offset.x = (Math.abs(item_n_pos.x) + ((itemSize.width - viewSize.width) / 2));
            _offset.y = 0;

            vec2_t1.x = Math.abs(currOffset.x) + _offset.x;
            vec2_t1.y = 0;


            let offset = vec2_t1;
            cc.log("offset: ", JSON.parse(JSON.stringify(offset)));
            scroll.scrollToOffset(offset, SCROLL_INTERVAL);

        }
        cc.log("_offset:", JSON.parse(JSON.stringify(_offset)));

        return _offset;

    }

    /**
     * 指示线移动
     *  点击item时，
     * @param {cc.Node} item 点击的item
     * @param {boolean} [useTween = true] 是否使用缓动,初始化或由隐藏显示时无需缓动 默认值true
     * @param {cc.Vec2} [offset = (0,0)] 自动调整的偏移值（得mul(-1)）
     */
    private barMove(item: cc.Node, useTween: boolean = false, offset: cc.Vec2 = cc.v2(0, 0)) {
        const BAR_MOVE_INTERVAL = 0.3;
        let tabs_nav_wrap = cc.find("tabs__header/tabs__nav-wrap", this.node);

        // let tabs_nav_prev = cc.find("tabs__nav-prev", tabs_nav_wrap);
        // let tabs_nav_next = cc.find("tabs__nav-next", tabs_nav_wrap);
        // let tabs_nav_scroll = cc.find("tabs__nav-scroll", tabs_nav_wrap);
        // let tabs_nav_line = cc.find("tabs__nav-line", tabs_nav_wrap);
        let tabs_bar_mask_n = cc.find("tabs__active-bar-mask", tabs_nav_wrap);

        // let hditemRoot = cc.find("view/tabs__nav", tabs_nav_scroll);


        let tabs_bar = cc.find("tabs__active-bar", tabs_bar_mask_n);

        // cc.log("bar:", tabs_bar);
        // cc.log("item:", item);
        let hditemBarRefer = cc.find("bar-refer", item);
        // let pos = tabs_bar.parent.convertToNodeSpaceAR(hditemBarRefer.convertToWorldSpaceAR(cc.Vec2.ZERO));
        // console.log("node_t节点相对于bar父节点的坐标", JSON.parse(JSON.stringify(newPos)));



        // item点击时自动调整，可能会自动scrolling,
        if (useTween) {
            this.setHditemBarReferPos(hditemBarRefer, item, offset.mul(-1));

            let pos = tabs_bar.parent.convertToNodeSpaceAR(hditemBarRefer.convertToWorldSpaceAR(cc.Vec2.ZERO));
            // tabs_bar.setPosition(pos.x, pos.y, 0);
            cc.tween(tabs_bar).to(BAR_MOVE_INTERVAL, {
                x: pos.x,
                y: pos.y,
            }).start();
        } else {
            this.setHditemBarReferPos(hditemBarRefer, item);
            let pos = tabs_bar.parent.convertToNodeSpaceAR(hditemBarRefer.convertToWorldSpaceAR(cc.Vec2.ZERO));
            tabs_bar.setPosition(pos.x, pos.y, 0);
        }
    }

    /**
     * 显示指示线
     */
    private showBar() {
        if (this.tabs_bar) {
            this.tabs_bar.opacity = 255;
        }
    }

    /**
     * 隐藏指示线
     */
    // private hideBar(tabs_bar?: cc.Node) {
    private hideBar() {
        // if (!tabs_bar) {
        //     let tabs_nav_wrap = cc.find("tabs__header/tabs__nav-wrap", this.node);
        //     let tabs_bar_mask_n = cc.find("tabs__active-bar-mask", tabs_nav_wrap);
        //     tabs_bar = cc.find("tabs__active-bar", tabs_bar_mask_n);
        // }
        if (this.tabs_bar) {
            this.tabs_bar.opacity = 0;
        }

    }

    /**
     * 计算item的尺寸
     */
    // private calcItemSize(item: cc.Node) {
    //     // border
    //     return cc.size(item.width, item.height);
    // }
    /**
     * 下一页
     */
    private nextPage() {
        const PAGE_DOWN_INTERVAL = 0.3;
        // 翻页
        let tabs_nav_scroll = cc.find("tabs__header/tabs__nav-wrap/tabs__nav-scroll", this.node);
        let tabs_nav_view = cc.find("view", tabs_nav_scroll);

        // cc.log("tabs_nav_view width:", tabs_nav_view.width);
        // cc.log("tabs_nav_view height:", tabs_nav_view.height);


        let scroll = tabs_nav_scroll.getComponent(cc.ScrollView);
        // 判断是否是末尾 ，滚动 view宽度 
        let curOffset = scroll.getScrollOffset();
        let maxOffset = scroll.getMaxScrollOffset();

        let isEnd = false;
        cc.log("curOffset:", JSON.parse(JSON.stringify(curOffset)));
        cc.log("maxOffset:", JSON.parse(JSON.stringify(maxOffset)));
        if (maxOffset.x == curOffset.x) {// 方向待改
            cc.log("已经到末尾了");
            isEnd = true;
        } else {
            // tabs_nav_view.height
            // 右滚动 -width
            // 左滚动 +width
            // 上滚动 -height
            // 下滚动 +height
            // let offset = new cc.Vec2(tabs_nav_view.width, 0);// 方向待改
            vec2_t1.x = -tabs_nav_view.width;
            vec2_t1.y = 0;
            let moveBy = vec2_t1;// 方向待改

            if (Math.abs((curOffset.x + moveBy.x)) >= maxOffset.x) {
                cc.log("直接跳到末尾");
                scroll.scrollToRight(PAGE_DOWN_INTERVAL);// 参数待设定
                isEnd = true;
            } else {
                // 通过scrollTo api去移动
                // vec2_t2.x = Math.abs((moveBy.x + curOffset.x) / maxOffset.x);
                // vec2_t2.y = 0;
                // let anchor = vec2_t2;
                // cc.log("scrollTo anchor: ", JSON.parse(JSON.stringify(anchor)));
                // scroll.scrollTo(anchor, PAGE_DOWN_INTERVAL);


                // 通过scrollToOffset api去移动
                vec2_t2.x = Math.abs(curOffset.x + moveBy.x);
                vec2_t2.y = 0;
                let offset = vec2_t2;
                cc.log("scrollTo offset: ", JSON.parse(JSON.stringify(offset)));
                scroll.scrollToOffset(offset, PAGE_DOWN_INTERVAL);

            }
        }

        // 是否禁用按钮
        if (isEnd) {
            cc.log("禁用next按钮");

            // 点击事件得用button的
            // this.tabs_nav_next.getComponent(cc.Button).interactable = false;
        } else {

        }
    }

    /**
     * 上一页
     */
    private prevPage() {
        const PAGE_DOWN_INTERVAL = 0.3;
        // 翻页
        let tabs_nav_scroll = cc.find("tabs__header/tabs__nav-wrap/tabs__nav-scroll", this.node);
        let tabs_nav_view = cc.find("view", tabs_nav_scroll);

        // cc.log("tabs_nav_view width:", tabs_nav_view.width);
        // cc.log("tabs_nav_view height:", tabs_nav_view.height);


        let scroll = tabs_nav_scroll.getComponent(cc.ScrollView);
        // 判断是否是开头 ，滚动 view宽度 
        let curOffset = scroll.getScrollOffset();
        let maxOffset = scroll.getMaxScrollOffset();

        let isStart = false;
        cc.log("curOffset:", JSON.parse(JSON.stringify(curOffset)));
        // cc.log("maxOffset:", JSON.parse(JSON.stringify(maxOffset)));
        if (curOffset.x == 0) {// 方向待改
            cc.log("已经到开头了");
            isStart = true;
        } else {
            // tabs_nav_view.height
            // 右移 -width
            // 左移 +width
            // 上移 -height
            // 下移 +height
            // let offset = new cc.Vec2(tabs_nav_view.width, 0);// 方向待改
            vec2_t1.x = tabs_nav_view.width;
            vec2_t1.y = 0;
            let moveBy = vec2_t1;// 方向待改

            if (Math.floor(Math.abs(curOffset.x)) <= tabs_nav_view.width) {
                cc.log("直接跳到开头");
                scroll.scrollToLeft(PAGE_DOWN_INTERVAL);// 参数待设定
                isStart = true;
            } else {
                // 通过scrollTo api去移动
                // vec2_t2.x = Math.abs((moveBy.x + curOffset.x) / maxOffset.x);
                // vec2_t2.y = 0;
                // let anchor = vec2_t2;
                // cc.log("scrollTo anchor: ", JSON.parse(JSON.stringify(anchor)));
                // scroll.scrollTo(anchor, PAGE_DOWN_INTERVAL);

                // 通过scrollToOffset api去移动
                vec2_t2.x = Math.abs(curOffset.x + moveBy.x);
                vec2_t2.y = 0;
                let offset = vec2_t2;
                cc.log("scrollTo offset: ", JSON.parse(JSON.stringify(offset)));
                scroll.scrollToOffset(offset, PAGE_DOWN_INTERVAL);
            }
        }

        // 是否禁用按钮
        if (isStart) {
            cc.log("禁用prev按钮");
        }
    }

    /**
     * 关闭事件
     * @param item 
     */
    private close(item: cc.Node) {

    }

    /**
     * 
     * @param scroll 
     * @param event 
     */
    private onScrolling(scroll: cc.ScrollView, event) {
        // cc.log("scroll: ", scroll);
        // cc.log("curOffset:", JSON.parse(JSON.stringify(scroll.getScrollOffset())));

        // cc.log("itemRoot_pos:", JSON.parse(JSON.stringify(scroll.content.position)));


        // if (!this._isActiving && this._current) {
        if (this._current) {
            // let tabs_nav_wrap = cc.find("tabs__header/tabs__nav-wrap", this.node);
            // let tabs_bar_mask_n = cc.find("tabs__active-bar-mask", tabs_nav_wrap);
            // let tabs_bar = cc.find("tabs__active-bar", tabs_bar_mask_n);

            let item = this._current;
            let hditemBarRefer = cc.find("bar-refer", item);
            this.setHditemBarReferPos(hditemBarRefer, item);
            let pos = this.tabs_bar.parent.convertToNodeSpaceAR(hditemBarRefer.convertToWorldSpaceAR(cc.Vec2.ZERO));
            this.tabs_bar.setPosition(pos.x, pos.y, 0);
        }
    }

    update(dt) {
        /** 这样写不好，换成事件cc.Node.EventType.SIBLING_ORDER_CHANGED */
        /*
        if (this._getOrderedPos > 0) {
            if (this._getOrderedPos === 1) {
                let offset = this.autoAdjustItemPos(this._current);
                this.barMove(this._current, true, offset);
            }
            this._getOrderedPos--;
            // cc.log("update中 _current 的位置: ", JSON.parse(JSON.stringify(this._current.position)), this._current.data.data.label);


        }
         */
    }
    // protected lateUpdate(dt: number): void {
    //     if (this._getOrderedPos > 0) {
    //         this._getOrderedPos--;
    //         cc.log("lateUpdate中 _current 的位置: ", JSON.parse(JSON.stringify(this._current.position)), this._current.data.data.label);
    //     }
    // }

}
