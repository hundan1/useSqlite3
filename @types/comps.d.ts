
/**@description 生成双向绑定数据*/
declare class BindVal<T>{
    /**
     * @description 构造函数
     * @param {T} val 绑定数据的初始值
     * @param {T} [name] 数据变量名称如"value"
    */
    constructor(val: T, name?: string) { }

    /**
     * @description 自定义数据监听方法,只有使用set对数据更改才能监听到
     * @param {T} [newVal] 新值
     * @param {T} [oldVal] 旧值
    */
    public watch: (newVal?: T, oldVal?: T) => void;
    /**@description 获取值 */
    public get(): T;
    /**@description 设置值 */
    public set(val: T): void;
}


declare module cc {

    export interface Node {
        /**@description 用户自定义数据 */
        data: any;
    }
}

interface IHDTreeProps {
    //  | ((data: any, node: any) => string)
    /**@description 指定节点标签为节点对象的某个属性值 默认值为label*/
    "label": string,
    /**@description 指定子树为节点对象的某个属性值	默认值为children*/
    "children": string,
    /**@description 指定节点选择框是否禁用为节点对象的某个属性值, function (data, node)*/
    "disabled"?: boolean | ((data: any, node: any) => any),
    /**@description 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效	*/
    "isLeaf"?: boolean | ((data: any, node: any) => any),
}


interface IHDTreeOpts {
    /**@description 展示数据 */
    "data": Array<any>,
    /**@description 内容为空时展示的文本 */
    "emptyText"?: string,
    /**@description 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 */
    "nodeKey"?: string,
    /**@description 配置选项，具体看下表*/
    "props"?: IHDTreeProps,
    /**@description 是否在第一次展开某个树节点后才渲染其子节点 默认值为true*/
    "renderAfterExpand"?: boolean,
    /**@description 加载子树数据的方法，仅当 lazy 属性为true 时生效*/
    "load"?: (node: any, resolve: any) => any,
    /**@description 树节点的内容区的渲染 Function*/
    "renderContent"?: (h: any, { node, data, store }: any) => any,
    /**@description 是否高亮当前选中节点，默认值是 false。 */
    "highlightCurrent"?: boolean,
    /**@description 是否默认展开所有节点，默认值是 false。 */
    "defaultExpandAll"?: boolean,
    /**@description 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。*/
    "expandOnClickNode"?: boolean,
    /**@description 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。*/
    "checkOnClickNode"?: boolean,
    /**@description 展开子节点的时候是否自动展开父节点， 默认值为 true。*/
    "autoExpandParent"?: boolean,
    /**@description 默认展开的节点的 key 的数组默认值为 []*/
    "defaultExpandedKeys"?: [],
    /**@description 节点是否可被选择 默认值为 false*/
    "showCheckbox"?: boolean,
    /**@description 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false*/
    "checkStrictly"?: boolean,
    /**@description 默认勾选的节点的 key 的数组，默认为 []*/
    "defaultCheckedKeys"?: [],
    /**@description 当前选中的节点*/
    "currentNodeKey"?: string | number,
    /**@description 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏*/
    "filterNodeMethod"?: (value: any, data: any, node: any) => boolean,
    /**@description 是否每次只打开一个同级树节点展开(手风琴模式)， 默认值为 false。*/
    "accordion"?: boolean,
    /**@description 相邻级节点间的水平缩进，单位为像素。默认30*/
    "indent"?: number,
    /**@description 自定义树节点的图标*/
    // "icon-class"?: string,
    /**@description 是否懒加载子节点，需与 load 方法结合使用，默认为 false*/
    "lazy"?: boolean,
    /**@description 是否开启拖拽节点功能，默认为 false*/
    "draggable"?: boolean,
    /**@description 判断节点能否被拖拽*/
    "allowDrag"?: (node: any) => boolean,
    /**@description 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后*/
    "allowDrop"?: (draggingNode: any, dropNode: any, type: any) => boolean,


    /**start event */
    /**@description 节点被点击时的回调 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。*/
    "onNodeClick"?: (data?, node?: cc.Node, comp?) => any,
}


interface IHDTabsOpts {
    /**@description 选项卡面板渲染信息,默认为[]*/
    "rPanes"?: Array<IHDTabPaneOpts>,

    /**@description 选项卡样式配置信息*/
    "styles"?: IHDTabStyles,

    /**@description 绑定值，选中选项卡的 name ，默认值 第一个选项卡的 name*/
    // "value"?: string,
    /**
     * @description  绑定值，选中选项卡的 name 绑定值，选中选项卡的 name ，默认值 如果rPanes不为[]，则默认值为第一个选项卡的 name；否则为BindVal<string>(null,value) 。init()之后，更改value值，请用BindVal.set方法，取值用BindVal.get方法
     * 
    */
    "value"?: BindVal<string>,
    // /**@description 有value就行了*/
    // "model"?: string, 
    /**@description 风格类型 可选值card<选项卡>/border-card<卡片化>/default<下划线> 默认值 default */
    "type"?: string,
    /**@description 是否可以被关闭 默认值 false ; 优先级比IHDTabPaneOpts.closable高，当该值为true时，选项全部可关闭，IHDTabPaneOpts.closable无效*/
    "closable"?: boolean,
    /**@description 标签是否可增加 默认值 false*/
    "addable"?: boolean,
    /**@description 标签是否同时可增加和关闭 默认值 false*/
    "editable"?: boolean,
    /**@description 选项卡所在位置 可选值top/right/bottom/left 默认值 top*/
    "tabPosition"?: string,
    /**@description 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。*/
    "beforeLeave"?: (activeName, oldActiveName) => boolean | Promise<any>,



    /** start event */
    /**@description tab 被选中时触发 回调参数:被选中的标签 信息,事件对象*/
    "onTabClick"?: (data: any, event: cc.Event.EventTouch) => any,
    // /**@description 点击 tab 移除按钮后触发 回调参数:被删除的标签的 name*/
    /**@description 点击 tab 移除按钮后触发 回调参数:被删除的标签的 name！！！注意移除功能需要自己调用 脚本.remove(name)移除*/
    "onTabRemove"?: (name: string) => any,

    /**@description 点击 tabs 的新增按钮后触发 回调参数:无*/
    "onTabAdd"?: () => any,
    /**@description 点击 tabs 的新增按钮或 tab 被关闭后触发 回调参数:(targetName, action)*/
    "onTabEdit"?: (name: string, action) => any,
}

interface IHDTabPaneOpts {
    /**@description 选项卡标题 默认值为label*/
    "label": string,
    /**@description 与选项卡绑定值 value 对应的标识符，表示选项卡别名。最后保证name唯一，否则移除时可能误移除。	默认值 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'*/
    "name": string,
    /**@description 是否禁用 默认值false*/
    "disabled"?: boolean,
    /**@description 标签是否可关闭，默认值false; 优先级小于IHDTabsOpts.closable,只有当 IHDTabsOpts.closable为false才生效*/
    "closable"?: boolean,
    /**@description 标签是否延迟渲染，默认值false*/
    "lazy"?: boolean,

    /**@description 自定义数据*/
    "data"?: any,
    /**@description 渲染方法，默认在pane渲染一个string为label得cc.Label*/
    "render"?: () => cc.Node,

}
interface IHDTabStyles {
    /**@description 宽度 数字时 如300 代表 300px，字符串时为百分比如: "100%" 代表父节点宽度的100%  默认值300px*/
    width?: string | number,
    /**@description 高度 数字时 如300 代表 300px，字符串时为百分比如: "100%" 代表父节点高度的100%  默认值300px*/
    height?: string | number,
    /**@description 头部样式 */
    header?: IHDTabHdStyles,
    /**@description 头部样式 */
    activeHeader?: IHDTabHdStyles,
}

/** 头部样式 */
interface IHDTabHdStyles {
    /**@description 宽度 数字时 如300 代表 300px，字符串时为百分比如: "100%" 代表父节点宽度的100%  默认值100%*/
    width?: string | number,
    /**@description 高度 数字时 如40 代表 40px，字符串时为百分比如: "100%" 代表父节点高度的100%  默认值40px*/
    height?: string | number,
    /**@description margin*/
    margin?: {
        /**@description margin-bottom 默认值20px*/
        bottom?: number,
    },
    /**@description 上一页按钮*/
    prev?: {
        /**@description 宽度 默认值16受方向影响*/
        width?: number,
        /**@description 高度 默认值40受方向影响*/
        height?: number,
    },
    /**@description 下一页按钮*/
    next?: {
        /**@description 宽度 默认值16受方向影响*/
        width?: number,
        /**@description 高度 默认值40受方向影响*/
        height?: number,
    },
    /**@description item*/
    item?: {
        /**@description 宽度 默认值100受方向影响*/
        width?: number,
        /**@description 高度 默认值40受方向影响*/
        height?: number,

        /**@description 相邻节点之间的水平距离 默认值10 受方向影响*/
        spacingX?: number,
        /**@description 相邻节点之间的垂直距离 默认值10 受方向影响*/
        spacingY?: number,

        /**@description 内padding 不会影响实际item宽高，只会影响内部label最大尺寸*/
        padding?: {
            /**@description padding-top 默认值0px*/
            top?: number,
            /**@description padding-bottom 默认值0px*/
            bottom?: number,
            /**@description padding-left 默认值20px*/
            left?: number,
            /**@description padding-right 默认值20px*/
            right?: number,
        },
        // /**@description margin */
        // margin?: {
        //     /**@description margin-top 默认值0px*/
        //     top?: number,
        //     /**@description margin-bottom 默认值0px*/
        //     bottom?: number,
        //     /**@description margin-left 默认值10px*/
        //     left?: number,
        //     /**@description margin-right 默认值0px*/
        //     right?: number,
        // },
        /**@description 背景颜色，默认值cc.Color(188,188,188,255),即#BCBCBC*/
        bgColor?: cc.Color,
    },
    // /**@description 最后一个item,样式特殊处理*/
    // lastItem?: {
    //     /**@description 宽度 默认值100受方向影响*/
    //     width?: number,
    //     /**@description 高度 默认值40受方向影响*/
    //     height?: number,

    //     /**@description 内padding 不会影响实际item宽高，只会影响内部label最大尺寸*/
    //     padding?: {
    //         /**@description padding-top 默认值0px*/
    //         top?: number,
    //         /**@description padding-bottom 默认值0px*/
    //         bottom?: number,
    //         /**@description padding-left 默认值20px*/
    //         left?: number,
    //         /**@description padding-right 默认值20px*/
    //         right?: number,
    //     },
    //     /**@description margin */
    //     margin?: {
    //         /**@description margin-top 默认值0px*/
    //         top?: number,
    //         /**@description margin-bottom 默认值0px*/
    //         bottom?: number,
    //         /**@description margin-left 默认值0px*/
    //         left?: number,
    //         /**@description margin-right 默认值0px*/
    //         right?: number,
    //     },

    //     /**@description 背景颜色，默认值cc.Color(188,188,188,255),即#BCBCBC*/
    //     bgColor?: cc.Color,
    // },
    /**@description label*/
    label?: {
        /**@description 字体大小 默认值16*/
        fontSize?: number,
        /**@description 行高 默认值28*/
        lineHeight?: number,
        /**@description 颜色，默认值cc.Color.WHITE,即#FFFFFF*/
        color?: cc.Color,
        /**@description 背景颜色，默认值cc.Color(188,188,188,255),即#BCBCBC*/
        bgColor?: cc.Color,
    },
    /**@description 指示线背景线*/
    line?: {
        /**@description 颜色，默认值cc.Color(62,62,62,255),即#3E3E3E*/
        color?: cc.Color,
        /**@description 宽度 默认值2 受方向影响*/
        width?: number,
        /**@description 高度 默认值2 受方向影响*/
        height?: number,
    },
    /**@description 当前选中底部指示线*/
    bar?: {
        /**@description 颜色，默认值cc.Color(49,236,255,255),即#31ECFF*/
        color?: cc.Color,
        /**@description 宽度 默认值2受方向影响*/
        width?: number,
        /**@description 高度 默认值2 受方向影响*/
        height?: number,
    }
}

// enum IHDTabDirection {
//     TOP = "top",
//     BOTTOM = "bottom",
//     LEFT = "left",
//     RIGHT = "right",
// }

