const { ccclass, property } = cc._decorator;

/**
 * @name hd-tree
 * @description 树
 * 
 * 每个节点node（即tree-node__content）如果想搞（上下margin或padding）,改该节点高度，然后改它下面的子节点bg widget top和bottom值
 * 
 * 选中节点效果，改 tree-node__content bg和label的颜色
 * 此处设置选中节点样式 #1
 * 
 * 使用到cocos模块:
 *  Sprite、Label、Renderer Texture、Widget、ScrollView、ScrollBar、Graphics、Action、Widget、Mask、Layout
 */

/**
 * 
 * 有空学学element-ui源码，是否可以搞这 html5元素->cocoscreator node 转换层
 */
@ccclass
export default class HDTree extends cc.Component {
    // private treePrfb: cc.Prefab = null;
    private treeitemPrfb: cc.Prefab = null;
    private _opts: IHDTreeOpts;
    private _nodeMap: Map<number, cc.Node> = new Map<number, cc.Node>();
    private _current: cc.Node = null;// 当前选中的节点
    private _expandeds: Set<number> = new Set<number>();

    // 别用_id这个变量
    private _nodeId_ = 0;
    private get _nodeId() {
        let _nodeId_ = this._nodeId_;
        this._nodeId_++;
        return _nodeId_;
    }
    private set _nodeId(val) {

    }

    onLoad() {

    }
    start() {
    }

    /** ----Function start ---- */
    public init({
        data = [], /**展示数据 */
        emptyText = "", /**内容为空时展示的文本 */
        nodeKey = "", /**每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 */
        props = {
            label: "label",
            children: "children"
        }, /**配置选项，具体看下表*/
        renderAfterExpand = true, /**是否在第一次展开某个树节点后才渲染其子节点 默认值为true*/
        load = null, /**加载子树数据的方法，仅当 lazy 属性为true 时生效*/
        renderContent = null, /**树节点的内容区的渲染 Function*/
        highlightCurrent = false, /**是否高亮当前选中节点，默认值是 false。 */
        defaultExpandAll = false, /**是否默认展开所有节点，默认值是 false。 */
        expandOnClickNode = false, /**是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。*/
        checkOnClickNode = false, /**是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。*/
        autoExpandParent = true, /**展开子节点的时候是否自动展开父节点， 默认值为 true。*/
        defaultExpandedKeys = [], /**默认展开的节点的 key 的数组默认值为 []*/
        showCheckbox = false, /**节点是否可被选择 默认值为 false*/
        checkStrictly = false, /**在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false*/
        defaultCheckedKeys = [], /**默认勾选的节点的 key 的数组，默认为 []*/
        currentNodeKey = "", /**当前选中的节点*/
        filterNodeMethod = null, /**对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏*/
        accordion = false,/**是否每次只打开一个同级树节点展开(手风琴模式)， 默认值为 false。*/
        indent = 30,/**相邻级节点间的水平缩进，单位为像素。默认30*/
        // "icon-class"= string,/**自定义树节点的图标*/
        lazy = false,   /**是否懒加载子节点，需与 load 方法结合使用，默认为 false*/
        draggable = false,   /**是否开启拖拽节点功能，默认为 false*/
        allowDrag = null,    /**	判断节点能否被拖拽*/
        allowDrop = null,    /**拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后*/



        /**events start */
        onNodeClick = null,/**节点被点击时的回调 **/
        /**events end */
    }
        : IHDTreeOpts) {


        // 获取场景中的预制
        // this.treePrfb = cc.find("Canvas/prefabs/hd-tree") as any;
        this.treeitemPrfb = cc.find("Canvas/prefabs/hd-treeitem") as any;

        if (!this.treeitemPrfb) {
            cc.warn("未找到场景中prefabs节点下的预制 hd-treeitem");
            return;
        }
        if (data.length) {
            this._setOpts({
                data, emptyText, nodeKey, props, renderAfterExpand, load, renderContent, highlightCurrent, defaultExpandAll, expandOnClickNode, checkOnClickNode, autoExpandParent, defaultExpandedKeys, showCheckbox, checkStrictly, defaultCheckedKeys, currentNodeKey, filterNodeMethod, accordion, indent, lazy, draggable, allowDrag, allowDrop,
        /**events start */ onNodeClick,/**events end */

            });

            let treeRoot = cc.find("view/content", this.node);
            // let treeRoot = this.node.getComponent(cc.ScrollView).content;
            this.generateNode(treeRoot, data, 1);

            // treeRoot.getComponent(cc.Layout).updateLayout();
            // cc.log("treeRoot: ", treeRoot);
            // cc.log("hd-tree: ", this.node);
        }
    }
    /** ----Function end ---- */

    /** ----Events start ---- */

    /** ----Events end ---- */








    private _setOpts(options: IHDTreeOpts) {
        // cc.log("onNodeClick: ", options.onNodeClick);
        // this._opts = JSON.parse(JSON.stringify(options));
        this._opts = options;
        // cc.log("_opts.onNodeClick: ", this._opts.onNodeClick);// JSON.parse(JSON.stringify(options)) 会把函数搞没了
    }

    /**
     * 
     * @param parent 
     * @param data 
     * @param z 层级
     */
    private generateNode(parent: cc.Node, data: Array<any>, z: number) {
        data.forEach((item, index) => {
            // let labelKey = "label";
            // if (this._opts.props.label instanceof Function) {
            //     labelKey = this._opts.props.label(null, null);
            // } else {
            //     labelKey = this._opts.props.label;
            // }
            let labelKey = this._opts.props.label;
            let childrenKey = this._opts.props.children;
            let { [labelKey]: label, [childrenKey]: children } = item;

            let treeitem = cc.instantiate(this.treeitemPrfb);
            treeitem.name = "treeitem";
            treeitem.parent = parent;
            treeitem.data = { node: { z }, data: JSON.parse(JSON.stringify(item)) };
            treeitem.active = true;

            this.setTreeitem(treeitem, index);

            let children_n = cc.find("tree-node__children", treeitem);

            if ((<[]>children).length != 0) {
                this.generateNode(children_n, children, z + 1);
            }

            // children_n.getComponent(cc.Layout).updateLayout();
        });
    }

    // 配置子节点信息
    private setTreeitem(treeitem: cc.Node, index: number) {
        let labelKey = this._opts.props.label;
        let childrenKey = this._opts.props.children;
        let { data: { [labelKey]: label, [childrenKey]: children }, node: { z } } = treeitem.data;

        let nodeId = this._nodeId;// 一个 tree-node__content算一个节点
        // console.log("nodeId: ", nodeId);
        let isLeaf = (<[]>children).length == 0;


        let item_root = cc.find("tree-node__content", treeitem);
        this._nodeMap.set(nodeId, item_root);


        let expand_icon = cc.find("tree-node__content/tree-node__expand-icon", treeitem);
        let label_cter = cc.find("tree-node__content/tree-node__label__container", treeitem);
        let label_n = cc.find("tree-node__content/tree-node__label__container/tree-node__label", treeitem);
        let children_n = cc.find("tree-node__children", treeitem);

        const icon_pd = 5;


        let icon_wgt = expand_icon && expand_icon.getComponent(cc.Widget) || null;
        if (icon_wgt) {
            // icon_wgt.isAlignLeft = true;
            icon_wgt.left = icon_pd + (z - 1) * this._opts.indent;
        }

        if (isLeaf) {
            expand_icon.active = false;
        } else {
            item_root.on(cc.Node.EventType.TOUCH_END, this.expandNode, this);// 点击非叶子节点才可以展开
        }

        item_root.on(cc.Node.EventType.TOUCH_END, this.clickNode, this);

        let label_cter_wgt = label_cter && label_cter.getComponent(cc.Widget) || null;
        if (label_cter_wgt) {
            // label_cter_wgt.isAlignLeft = true;
            label_cter_wgt.left = z * this._opts.indent;
        }

        let label_label = label_n && label_n.getComponent(cc.Label) || null;
        if (label_label) {
            // label_cter_wgt.isAlignLeft = true;
            label_label.string = label;
        }

        /** 是否默认展开所有节点*/
        let isExpanded = this._opts.defaultExpandAll;

        if (!isExpanded) {
            children_n.scaleY = 0;
            expand_icon.angle = 0;
        } else {
            /**是否每次只打开一个同级树节点展开(手风琴模式)， 默认值为 false。*/
            // accordion
            if (!isLeaf) {
                if (this._opts.accordion) {
                    if (index == 0) {
                        // 全展开模式+手风琴 只打开每级的第一个
                        this._expandeds.add(nodeId);// 记录展开的节点id
                    } else {
                        isExpanded = false;
                        children_n.scaleY = 0;
                        expand_icon.angle = 0;
                    }
                } else {
                    this._expandeds.add(nodeId);// 记录展开的节点id
                }
            }
        }

        // cc.log("_expandeds:", this._expandeds);

        if (isLeaf) {
            isExpanded = false;
        }


        item_root.data = { node: { isExpanded, id: nodeId, isLeaf, isCurrent: false, z, index }, data: treeitem.data.data }
    }

    private expandNode(event: cc.Event.EventTouch) {
        // let node = e.target;
        // cc.log("event: ", event);
        let item_root = <cc.Node>event.target;
        let expand_content = cc.find("tree-node__children", item_root.parent);
        let spinner = cc.find("tree-node__expand-icon", item_root);
        // cc.log("target:", item_root);
        // cc.log("tree-node__children:", expand_content);
        // cc.log("tree-node__expand-icon:", spinner);
        let { node: { isLeaf, id: nodeId, isExpanded, z } } = item_root.data;

        /**是否每次只打开一个同级树节点展开(手风琴模式)， 默认值为 false。*/
        // cc.log("_expandeds:", this._expandeds);
        if (this._opts.accordion && !isExpanded) {
            let iter = this._expandeds.values();
            for (let i = 0; i < this._expandeds.size; i++) {
                let nodeId = iter.next().value;
                let same_lvl_node = this._nodeMap.get(nodeId);
                if (same_lvl_node && same_lvl_node.data.node.z == z) {
                    // cc.log("关闭同级已打开的节点:", same_lvl_node);
                    let expand_content = cc.find("tree-node__children", same_lvl_node.parent);
                    let spinner = cc.find("tree-node__expand-icon", same_lvl_node);
                    expand_content.getComponent(cc.Animation).play("node_collapse");
                    spinner.getComponent(cc.Animation).play("spinner_collapse");
                    same_lvl_node.data.node.isExpanded = false;
                    this._expandeds.delete(nodeId);// 移除展开的节点id
                    break;
                }
            }
        }

        if (isExpanded) {
            expand_content.getComponent(cc.Animation).play("node_collapse");
            spinner.getComponent(cc.Animation).play("spinner_collapse");
            item_root.data.node.isExpanded = false;
            this._expandeds.delete(nodeId);// 移除展开的节点id
        } else {
            // item_root.getComponent(cc.Animation);

            expand_content.getComponent(cc.Animation).play("node_expand");
            spinner.getComponent(cc.Animation).play("spinner_expand");
            this._expandeds.add(nodeId);// 记录展开的节点id
            item_root.data.node.isExpanded = true;
        }
        event.stopPropagation();
    }

    /**点击节点时触发*/
    private clickNode(event: cc.Event.EventTouch) {
        // cc.log("event: ", event);
        let item_root = <cc.Node>event.target;
        let label_n = cc.find("tree-node__label__container/tree-node__label", item_root);
        let bg = cc.find("bg", item_root);
        // let expand_content = cc.find("tree-node__children", item_root.parent);
        // let spinner = cc.find("tree-node__expand-icon", item_root);
        // cc.log("target:", item_root);
        // cc.log("tree-node__label:", label_n);
        // cc.log("tree-node__children:", expand_content);
        // cc.log("tree-node__expand-icon:", spinner);
        // console.log(this._opts.onNodeClick);
        if (this._current) {
            this._current.data.node.isCurrent = false;
        }
        item_root.data.node.isCurrent = true;

        if (this._opts.highlightCurrent) {
            // 此处设置选中节点样式 #1
            if (this._current) {
                let old_label_n = cc.find("tree-node__label__container/tree-node__label", this._current);
                let old_bg = cc.find("bg", this._current);
                old_label_n.color = cc.Color.WHITE;
                old_bg.color = new cc.Color(193, 19, 19, 255)
            }

            label_n.color = cc.Color.BLACK;
            bg.color = cc.Color.YELLOW;
        }
        this._current = item_root;





        this._opts.onNodeClick && this._opts.onNodeClick(item_root.data.data, item_root);
    }




    // update (dt) {}
}
