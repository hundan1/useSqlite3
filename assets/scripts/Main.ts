import $formatSql from './utils/formatSql';
// import Database from "better-sqlite3";
import * as $moment from "moment";
// import sqlite3 from "sqlite3"
const { ccclass, property } = cc._decorator;

import projectC from './sqlite/controllers/ctrl.Project';
import taskC from './sqlite/controllers/ctrl.Task';
import ProjectDBI from './sqlite/dbi/dbi.Project';
import TaskDBI from './sqlite/dbi/dbi.Task';
import TestDBI from './sqlite/dbi/dbi.Test';
const taskD = new TaskDBI();
const projectD = new ProjectDBI();
const testD = new TestDBI();

import data_projects from './sqlite/data/projects';
import HDTree from '../comps/hd-tree/HDTree';
import HDTabs from '../comps/hd-tabs/HDTabs';


@ccclass
export default class Main extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // 
    // db = new Database("test.db", {
    //     verbose: cc.log,
    // });
    // db = new sqlite3.Database(':memory:');
    public viewRoot: cc.Node = null;


    private _loading: boolean = false;

    private _testNodeCoordinateSystem2 = false;

    public treePrfb: cc.Prefab = null;



    public tabsPrfb: cc.Prefab = null;
    public currTab: BindVal<string> = null;
    public tabPanes: IHDTabPaneOpts[] = [];
    onLoad() {
        this.currTab = new BindVal<string>("test0", "value");
        // this.currTab = new BindVal<string>("test3", "value");
        // this.currTab = new BindVal<string>("未知的name", "value");
        // this.currTab = undefined; // 未定义时，默认为第一个
        // this.currTab = null; // null时，默认为第一个
        this.tabPanes = [];
        Array(3).fill(0).forEach((el, index) => {
            this.tabPanes[this.tabPanes.length] =
            {
                label: "测试" + index,
                name: "test" + index,
                // closable: index % 2 == 0 ? false : true,
                closable: true,
                data: { t: "自定义数据" + index },
                render: null,
            };
        });
        // cc.log("tabPanes:", this.tabPanes);
    }
    start() {
        this.viewRoot = cc.find("Canvas/ViewRoot");
        this.treePrfb = cc.find("Canvas/prefabs/hd-tree") as any;
        this.tabsPrfb = cc.find("Canvas/prefabs/hd-tabs") as any;

        // console.log("jsb sqlite:",jsb["sql"]);
        // if (CC_JSB && cc.sys.isNative) {
        //     console.log("jsb.fileDownloader: ", jsb["fileDownloader"]);
        //     console.log("jsb.fileDownloader.download: ", jsb["fileDownloader"].download);
        //     if (jsb["fileDownloader"] && jsb["fileDownloader"].download) {
        //         jsb["fileDownloader"].download()
        //     }
        // }

        // if (CC_JSB && cc.sys.isNative) {
        //     console.log("foo: ", foo);
        //     this.testSomeClass();
        // }
        // console.log("start...");
        let now = $moment().format('YYYY-MM-DD HH:mm:ss');
        console.log("now: ", now);

        cc.log("cc.sys.isNative:", cc.sys.isNative);
        cc.log("cc.sys.isMobile:", cc.sys.isMobile);

        // 模拟器预览 CC_PREVIEW && CC_JSB


        // cc.log("CC_EDITOR:", CC_EDITOR);// 编辑器
        // cc.log("CC_DEV:", CC_DEV);// 编辑器 或 预览
        // cc.log("CC_DEBUG:", CC_DEBUG);// 编辑器 或 预览 或 构建调试
        // cc.log("CC_BUILD:", CC_BUILD);// 构建
        // cc.log("CC_PREVIEW:", CC_PREVIEW);
        // cc.log("CC_JSB:", CC_JSB);

        //  && !CC_PREVIEW
        if (CC_JSB && cc.sys.isNative) {
            // console.log("xxxx");

            // @ts-ignore
            // console.log("sql JSB: ", sql);
            // this.testSqlite3();


            // this.testSqlite3FW();
        }

        // this.testHDTree();
        this.testHDTabs();


        // this.testBackpack();
        // this.testNodeCoordinateSystem1();
        // this.testNodeCoordinateSystem2();
        // this.testNodeAddChild();
        // this.testOrderChildren();

    }
    /**测试指定位置添加子节点，获取排序后的位置 */
    testOrderChildren() {
        let root_ = cc.find("Canvas/ViewRoot/testOrderChildren");
        root_.active = true;
        let root = cc.find("case1", root_);
        if (root) {
            root.active = true;
            let container = cc.find("container", root);
            let item__ = cc.find("item", root);

            Array(4).fill(0).forEach((_, index) => {
                let item = cc.instantiate(item__);
                // item.setScale(0.5);
                let i = index;
                // if (i >= 2) {
                //     i++;
                // }
                item.name = "item" + i;
                cc.find("label", item).getComponent(cc.Label).string = item.name;
                item.active = true;
                // item.zIndex = i;
                item.parent = container;
            });
            let current = container.children[0];
            cc.log("添加前的位置:", JSON.parse(JSON.stringify(current.position)));

            Array(3).fill(0).forEach((_, index) => {
                let pos = 0;// 在指定索引处插入元素
                let item = cc.instantiate(item__);
                // item.setScale(0.5);
                let i = index;
                // if (i >= 2) {
                //     i++;
                // }
                item.name = "添加" + i;
                cc.find("label", item).getComponent(cc.Label).string = item.name;
                item.active = true;
                item.parent = container;
                item.setSiblingIndex(pos + index);
                // item.zIndex = i;
            });
            cc.log("添加后的位置:", JSON.parse(JSON.stringify(current.position)));

            current.on(cc.Node.EventType.SIBLING_ORDER_CHANGED, () => {
                cc.log("排序后的位置:", JSON.parse(JSON.stringify(current.position)));
            }, this);
        }
    }


    /**测试指定位置添加子节点 */
    testNodeAddChild() {
        let root = cc.find("Canvas/ViewRoot/testNodeAddChild");
        if (root) {
            root.active = true;
            let container = cc.find("container", root);
            let item__ = cc.find("item", root);

            Array(4).fill(0).forEach((_, index) => {
                let item = cc.instantiate(item__);
                let i = index;
                if (i >= 2) {
                    i++;
                }
                item.name = "item" + i;
                cc.find("label", item).getComponent(cc.Label).string = item.name;
                item.active = true;
                item.zIndex = i;
                item.parent = container;
            });


            let item2 = cc.instantiate(item__);
            item2.zIndex = 2;
            // 0 1 3 4
            // 第二个参数改的是渲染顺序
            // container.addChild(item2);
            // container.children.splice(2, 0, item2);

            // container.getComponent(cc.Layout).updateLayout();
            item2.active = true;
            item2.parent = container;

            cc.log("item2:", item2);
            cc.log("container:", container);
        }


    }

    /**测试节点坐标系 */
    testNodeCoordinateSystem1() {
        let root_ = cc.find("Canvas/ViewRoot/testNodeCoordinate");
        root_.active = true;
        let root = cc.find("case1", root_);
        root.active = true;

        let nodeA = cc.find("a", root);
        let nodeB = cc.find("b", root);
        let nodeC = cc.find("b/c", nodeB);
        cc.log("a节点在root节点<父节点>的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeA.position)));
        cc.log("b节点在root节点<父节点>的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeB.position)));

        // cc.log("a节点在b节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeA.convertToNodeSpaceAR(nodeB.position))));
        cc.log("a节点在b节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeA.convertToNodeSpaceAR(nodeB.convertToWorldSpaceAR(cc.v2(0, 0))).mul(-1))));

        cc.log("c节点在b节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeC.convertToNodeSpaceAR(nodeB.convertToWorldSpaceAR(cc.v2(0, 0))).mul(-1))));

        // cc.log("b节点在a节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeB.convertToNodeSpaceAR(nodeA.position))));
        // cc.log("a节点在（0,0）的世界坐标系坐标:", JSON.parse(JSON.stringify(nodeA.convertToWorldSpaceAR(cc.v2(0, 0)))));
        // cc.log("b节点在（0,0）的世界坐标系坐标:", JSON.parse(JSON.stringify(nodeB.convertToWorldSpaceAR(cc.v2(0, 0)))));
    }
    testNodeCoordinateSystem2() {
        // update中判断用，
        this._testNodeCoordinateSystem2 = true;

        let root_ = cc.find("Canvas/ViewRoot/testNodeCoordinate");
        root_.active = true;
        let root = cc.find("case2", root_);
        root.active = true;

        let scroll = cc.find("scroll", root);
        cc.tween(scroll).repeat(20, cc.tween(scroll).to(3, {
            "x": 100
        }).to(3, {
            "x": -100
        })).start();

        let mask = cc.find("mask", root);
        let bar = cc.find("bar", mask);
        cc.log("scroll坐标:", JSON.parse(JSON.stringify(scroll.position)));
        cc.log("bar坐标:", JSON.parse(JSON.stringify(bar.position)));

        /**https://blog.csdn.net/cui6864520fei000/article/details/89517910 */
        // let b_pos_in_s = scroll.convertToNodeSpaceAR(bar.convertToWorldSpaceAR(cc.Vec2.ZERO));
        // console.log("bar节点坐标转化到scroll下的坐标", JSON.parse(JSON.stringify(b_pos_in_s)));

        // let s_pos_in_b_parent = bar.parent.convertToNodeSpaceAR(scroll.convertToWorldSpaceAR(cc.Vec2.ZERO));

        // console.log("scroll节点相对于bar父节点的坐标", JSON.parse(JSON.stringify(s_pos_in_b_parent)));

        let node_t = new cc.Node("temp");
        node_t.parent = scroll;
        let pos = cc.v3(0, (bar.height - scroll.height) / 2, 0);// 贴底
        // node_t.width
        node_t.position = pos;
        node_t.addComponent(cc.Label).string = "temp";

        // let newPos = bar.parent.convertToNodeSpaceAR(node_t.convertToWorldSpaceAR(cc.Vec2.ZERO));
        // console.log("node_t节点相对于bar父节点的坐标", JSON.parse(JSON.stringify(newPos)));

        // bar.setPosition(newPos.x, newPos.y, 0);

        // 
        // bar.setPosition(bar.parent.convertToNodeSpaceAR(scroll.convertToNodeSpace(cc.v2(0, 0))));

        // cc.log("a节点在b节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeA.convertToNodeSpaceAR(nodeB.position))));
        // cc.log("a节点在b节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeA.convertToNodeSpaceAR(nodeB.convertToWorldSpaceAR(cc.v2(0, 0))).mul(-1))));

        // cc.log("c节点在b节点的节点坐标系坐标:", JSON.parse(JSON.stringify(nodeC.convertToNodeSpaceAR(nodeB.convertToWorldSpaceAR(cc.v2(0, 0))).mul(-1))));

        // cc.log("a节点在（0,0）的世界坐标系坐标:", JSON.parse(JSON.stringify(nodeA.convertToWorldSpaceAR(cc.v2(0, 0)))));
        // cc.log("bar节点在scroll父节点下的节点坐标系坐标:", JSON.parse(JSON.stringify(bar.convertToNodeSpaceAR(scroll.parent.position))));
        // cc.log("bar节点在scroll节点下的节点坐标系坐标:", JSON.parse(JSON.stringify(bar.convertToNodeSpaceAR(scroll.position))));
        // cc.log("b节点在（0,0）的世界坐标系坐标:", JSON.parse(JSON.stringify(nodeB.convertToWorldSpaceAR(cc.v2(0, 0)))));
    }

    testBackpack() {
        let root = cc.find("Canvas/ViewRoot/backpack");
        root.active = true;

        let scroll = cc.find("Canvas/ViewRoot/backpack").getComponent(cc.ScrollView);
        for (let i = 0; i < 40; i++) {
            let node = new cc.Node("item");
            node.setContentSize(300, 40);
            let label = node.addComponent(cc.Label);
            label.string = "test txt " + i;
            node.color = (cc.Color.BLACK);
            scroll.content.addChild(node);
        }
    }

    testHDTree() {
        if (!this.viewRoot) {
            cc.warn("场景中viewRoot节点不存在");
            return;
        }
        if (!this.treePrfb) {
            cc.warn("场景中prefabs/hd-tree节点不存在");
            return;
        }

        let treeData = [{
            label: "测试1",
            children: [{
                label: "测试1-1",
                children: [{
                    label: "测试1-1-1",
                    children: [],
                }]
            }],
        }, {
            label: "测试2",
            children: [{
                label: "测试2-1",
                children: [{
                    label: "测试2-1-1",
                    children: []
                }]
            }, {
                label: "测试2-2",
                children: [{
                    label: "测试2-2-1",
                    children: []
                }]
            }],
        }, {
            label: "测试3",
            children: [{
                label: "测试3-1",
                children: [{
                    label: "测试3-1-1",
                    children: []
                }]
            }, {
                label: "测试3-2",
                children: [{
                    label: "测试3-2-1",
                    children: []
                }]
            }],
        }];

        let treeNode = cc.instantiate(this.treePrfb);
        treeNode.parent = this.viewRoot;
        treeNode.active = true;
        treeNode.setPosition(cc.Vec3.ZERO);

        let treeNode_s = treeNode.addComponent(HDTree);
        treeNode_s.init({
            data: treeData,
            highlightCurrent: true,/**是否高亮当前选中节点，默认值是 false。 */
            defaultExpandAll: true,/**是否默认展开所有节点，默认值是 false。 */
            accordion: false,/**是否每次只打开一个同级树节点展开(手风琴模式)， 默认值为 false。*/
            onNodeClick(data, node) {
                // console.log(data, node);
            }
        });

    }

    /**
     * 生成选项卡
     * @returns 
     */
    testHDTabs() {
        if (!this.viewRoot) {
            cc.warn("场景中viewRoot节点不存在");
            return;
        }
        if (!this.tabsPrfb) {
            cc.warn("场景中prefabs/hd-tabs节点不存在");
            return;
        }


        let tabsNode = cc.instantiate(this.tabsPrfb);
        tabsNode.parent = this.viewRoot;
        tabsNode.active = true;
        tabsNode.setPosition(cc.Vec3.ZERO);

        let tabsNode_s = tabsNode.addComponent(HDTabs);
        tabsNode_s.init({
            rPanes: this.tabPanes,
            value: this.currTab,
            onTabRemove: (name) => {
                cc.log("remove tab name:", name);
                this.tabPanes.forEach((pane, index) => {
                    if (pane.name == name) {
                        cc.log("remove pane:", pane);
                        this.tabPanes.splice(index, 1);
                        tabsNode_s.remove(name);

                        if (this.tabPanes.length > 0) {

                            // 删除的是最后一个
                            if (this.tabPanes.length == index) {
                                // 显示删完后的最后一个
                                let currTab = this.tabPanes[index - 1];
                                this.currTab.set(currTab.name);
                            } else {
                                // 显示被删除的下一个
                                let currTab = this.tabPanes[index];
                                this.currTab.set(currTab.name);
                            }
                        }
                    }
                });
                // return true;
            }
        });


        let addButton = new cc.Node("添加按钮");
        addButton.parent = this.viewRoot;
        addButton.setPosition(-80, 180, 0);
        addButton.setContentSize(100, 30);

        let label = addButton.addComponent(cc.Label);
        label.string = "添加按钮";
        label.fontSize = 18;

        let obj = { i: 0 };
        let addItem = (pos: number, num = 1) => {
            let res = [];
            let index = 0;
            while (num--) {
                obj.i++;
                let item = {
                    label: "添加" + obj.i,
                    name: "testadd" + obj.i,
                    // closable: index % 2 == 0 ? false : true,
                    closable: true,
                    render: null,
                };
                if ((pos + index) >= 0 && (pos + index) <= this.tabPanes.length) {
                    this.tabPanes.splice(pos + index, 0, item);

                }
                res[res.length] = item;
                index++;
            }
            cc.log("tabPanes: ", this.tabPanes);
            return res;
        };

        addButton.on(cc.Node.EventType.TOUCH_END, () => {
            let pos = 0;
            let data = addItem(pos, 3);
            tabsNode_s.add(data, pos);
        }, this);


        let editButton = new cc.Node("编辑按钮");
        editButton.parent = this.viewRoot;
        editButton.setPosition(80, 180, 0);
        editButton.setContentSize(100, 30);

        let label_edit_btn = editButton.addComponent(cc.Label);
        label_edit_btn.string = "编辑按钮";
        label_edit_btn.fontSize = 18;

        editButton.on(cc.Node.EventType.TOUCH_END, () => {
            let data = this.tabPanes[0];
            data.label = "修改测试";
            data.render = () => {
                let node__ = cc.find("Canvas/ViewRoot/backpack");
                let node = cc.instantiate(node__);
                node.active = true;
                return node;
            };
            tabsNode_s.edit(data);
        }, this);

    }

    async testSqlite3FW() {
        const _this = this;
        // table --- projects 
        await _this.initTable();
        await _this.getProsData();
        // await _this.fetchData();

        // await _this.getData_pros();
        // await _this.addPro();
        // await _this.setPro();

        // table --- tasks 
        await _this.initTasksTable();
        await _this.getTasksData();
        await _this.fetchTaskData();
        await _this.task_temp1();
        await _this.task_temp2();


        // table --- test 
        await _this.initTestTable();
        await _this.testTableInsertData();
        await _this.testTableFetchAll();
        await _this.testTableFetchFilter();
        await _this.testTableSetById();
        await _this.testTableFetchDataById();
        await _this.testTableDelById();
        await _this.testTableFetchAll();

    }

    testSqlite3() {
        let sql_mng = new sql.SQLiteWrapper();
        // let is_open = sql_mng.initializing("dbs/test.db","UseSqlite3", "dbs", "dbs", "false");
        // let is_open = sql_mng.initializing("test.db","UseSqlite3", "", "", "false");
        let is_open = sql_mng.initializing("dbs/test.db", "UseSqlite3", "", "", "false");
        if (!is_open) {
            console.log("打开数据库文件失败:", sql_mng.errmsg());
            return;
        } else {
            console.log("打开数据库文件成功!");
        }

        let sql_str = `DROP TABLE IF EXISTS 'tests'`;
        let res = sql_mng.exec(sql_str);
        if (!res) {
            console.log("删除表失败:", sql_mng.errmsg());
            return;
        } else {
            console.log("删除表成功!");
        }

        // let sql_str = "create table if not exists 'user'(id integer primary key autoincrement,name varchar(64),age integer);"

        sql_str = `CREATE TABLE IF NOT EXISTS 'tests'(
            'id' INTEGER PRIMARY KEY NOT NULL,
            'str' VARCHAR COMMENT '文本测试' NOT NULL,
            'number' INT COMMENT '数字测试' DEFAULT 0,
            'modifytime' VARCHAR COMMENT '操作时间'
            );`
        res = sql_mng.exec(sql_str);
        if (!res) {
            console.log("创建表失败:", sql_mng.errmsg());
            return;
        } else {
            console.log("创建表成功!");
        }

        // 插入数据
        sql_str = "";
        let now = $moment().format('YYYY-MM-DD HH:mm:ss');
        for (let i = 0; i < 10; i++) {
            // sql_str += `insert into user values(null,'user${i + 1}',${(i % 3 + 2) * 10});`;
            sql_str += `insert into tests values(null,'str${i + 1}',${i + 1},'${now}');`;
        }
        res = sql_mng.exec(sql_str);
        if (!res) {
            console.log("插入数据失败:", sql_mng.errmsg());
            return;
        } else {
            console.log("插入数据成功!");
        }

        // 查询数据
        // sql_str = "select * from user";
        sql_str = "select * from tests";
        let stmt = sql_mng.statement(sql_str);
        if (!stmt) {
            console.log("sqlite3_prepare error:", sql_mng.errmsg());
        } else {
            let res = [];
            let col_n = stmt.getColumnCount();
            while (stmt.nextRow()) {
                let row = {};
                for (let i = 0; i < col_n; i++) {
                    let dt = stmt.dataType(i);
                    if (dt == sql.SQLiteStatement.DataType.INT) {
                        row[stmt.getColumnName(i)] = stmt.valueInt(i);
                    } else if (dt == sql.SQLiteStatement.DataType.TXT) {
                        row[stmt.getColumnName(i)] = stmt.valueString(i);
                    } else if (dt == sql.SQLiteStatement.DataType.NUL) {
                        row[stmt.getColumnName(i)] = stmt.valueString(i);
                    } else if (dt == sql.SQLiteStatement.DataType.FLT) {
                        row[stmt.getColumnName(i)] = stmt.valueDouble(i);
                    } else {
                        // 暂不支持BLOB数据解析
                        cc.error('strange data type: ', dt);
                    }
                }
                res[res.length] = row;
            }

            console.log("查询数据成功:", JSON.stringify(res));

            stmt.finalize();
            stmt = null;
        }

        // 关闭数据库
        res = sql_mng.close();
        if (!res) {
            console.log("关闭数据库失败:", sql_mng.errmsg());
            return;
        } else {
            console.log("关闭数据库成功!");
        }

    }

    testSomeClass() {
        cc.log('testSomeClass');

        var myObj = new ns.SomeClass();
        myObj.foo();
        ns.SomeClass.static_func();
        cc.log("ns.SomeClass.static_val: " + ns.SomeClass.static_val);
        cc.log("Old myObj.xxx:" + myObj.xxx);
        myObj.xxx = 1234;
        cc.log("New myObj.xxx:" + myObj.xxx);
        cc.log("myObj.yyy: " + myObj.yyy);

        var delegateObj = {
            onCallback: function (counter) {
                cc.log("Delegate obj, onCallback: " + counter + ", this.myVar: " + this.myVar);
                this.setVar();
            },

            setVar: function () {
                this.myVar++;
            },

            myVar: 100
        };

        myObj.setCallback(delegateObj.onCallback, delegateObj);

        setTimeout(function () {
            myObj.setCallback(null);
        }, 6000); // 6 秒后清空 callback


        myObj.foo();
    }


    async initTable() {
        const _this = this;
        await projectC.createTable().then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        });
    }
    // 获取项目数据
    async getProsData() {
        let _this = this;
        await _this.add_to_db(data_projects);
    }
    async getData_pros() {
        const _this = this;
        // projectD.get({
        // 	offset: 1,
        // 	limit: 1,
        // 	columns: ['*']
        // }).then(res => {
        // 	console.log(JSON.stringify(res));
        // }).catch(err => {
        // 	console.log(err);
        // });
        await projectC.get({
            // currpage: 1,
            // pagesize: 2,
        }).then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        });
    }
    async addPro() {
        const _this = this;
        await projectC.add({
            name: "0",
            describe: undefined
        }).then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        });
    }
    async setPro() {
        const _this = this;
        await projectC.set({
            id: 14,
            describe: '21-2-11-003',
            status: 0
        }).then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        });
    }
    // localstorage in db table projects 
    async add_to_db(data) {
        let _this = this;
        let rows = data.map(el => {
            let row = {
                old_id: el.id,
                name: el.name,
                status: el.status,
                describe: el.describe,
                createTime: el.createTime ? parseInt((el.createTime / 1000).toString()) : 0,
                startTime: el.startTime ? parseInt((el.startTime / 1000).toString()) : 0,
                completeTime: el.completeTime ? parseInt((el.completeTime / 1000).toString()) : 0,
                estimateTime: el.estimateTime ? parseFloat(el.estimateTime) : 0,
                estUnit: el.estUnit,
                realityTimeTxt: el.realityTime,
            };
            let realityTime = 0;
            if (el.startTime && el.completeTime) {
                realityTime = parseInt((el.completeTime / 1000).toString()) - parseInt((el.startTime / 1000).toString());
            }
            row["realityTime"] = realityTime;
            return row;
        });
        await projectC.temp_add(rows).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
    async fetchData() {
        let _this = this;
        await projectC.fetch().then(res => {
            console.log(JSON.stringify(res.rows));
        }).catch(err => {
            console.log(err);
        });
    }
    async initTasksTable() {
        const _this = this;
        await taskC.createTable().then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
    // 获取任务数据
    async getTasksData() {
        let _this = this;
        await _this.add_task_to_db(data_projects);
    }
    async add_task_to_db(data) {
        let _this = this;
        // console.log(JSON.stringify(data));
        let allTasks = [];
        data.forEach((el, index) => {
            if (el.task && el.task.list && el.task.list.length > 0) {
                let tasks = el.task.list;
                tasks.forEach(ele => {
                    let row = {
                        old_id: ele.id,
                        name: ele.name,
                        status: ele.status,
                        describe: ele.describe,
                        category: ele.category,
                        proId: 0,
                        old_proId: el.id,
                        old_parentId: ele.subTaskId + "",
                        createTime: ele.createTime ? parseInt((el.createTime / 1000).toString()) : 0,
                        startTime: ele.startTime ? parseInt((el.startTime / 1000).toString()) : 0,
                        completeTime: ele.completeTime ? parseInt((el.completeTime / 1000).toString()) : 0,
                        estimateTime: ele.estimateTime ? parseFloat(ele.estimateTime) : 0,
                        estUnit: ele.estUnit,
                        realityTimeTxt: ele.realityTime,
                    };
                    let realityTime = 0;
                    if (ele.startTime && ele.completeTime) {
                        realityTime = parseInt((el.completeTime / 1000).toString()) - parseInt((el.startTime / 1000).toString());
                    }
                    row["realityTime"] = realityTime;
                    allTasks.push(row);
                });

            }

        });

        // console.log(JSON.stringify(allTasks));
        await taskC.temp_add(allTasks).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
    async fetchTaskData() {
        let _this = this;
        await taskC.fetch().then(res => {
            console.log(JSON.stringify(res.rows));
        }).catch(err => {
            console.log(err);
        });
    }



    async initTestTable() {
        const _this = this;
        await testD.createTable().then(res => {
            if (res.code == 0) {
                console.log("初始化tests表成功");
            } else {
                console.log("初始化tests表失败", JSON.stringify(res));
            }
        }).catch(err => {
            console.log("初始化tests表失败:", err);
        });
    }

    async testTableInsertData() {
        const _this = this;
        for (let i = 0; i < 10; i++) {
            let data = {
                str: "测试" + i,
                number: i,
            };
            await testD.add(data).then(res => {
                if (res.code == 0) {
                    console.log("插入一条数据到tests表成功");
                } else {
                    console.log("插入一条数据到tests表失败");
                }

            }).catch(err => {
                console.log("插入一条数据到tests表失败:", err);
            });
        }
    }

    async testTableFetchFilter() {
        const _this = this;
        let condition = {
            offset: 2,
            limit: 3,
            columns: ["str", "number"],
            whereRow: "where number > 3",
        }
        await testD.get(condition).then(res => {
            if (res.code == 0) {
                console.log(`指定条件(${JSON.stringify(condition)})查询数据成功`, JSON.stringify(res));
            } else {
                console.log(`指定条件(${JSON.stringify(condition)})查询数据失败`, JSON.stringify(res));
            }


        }).catch(err => {
            console.log(`指定条件查询数据失败:`, err);
        });
    }

    async testTableSetById() {
        const _this = this;
        let id = 6;
        let data = {
            id,
            str: "测试66",
            number: 66
        };
        await testD.set(data).then(res => {
            if (res.code == 0) {
                console.log(`通过id(${id})修改数据成功`);
            } else {
                console.log(`通过id(${id})修改数据失败`);
            }
        }).catch(err => {
            console.log(`通过id(${id})修改数据失败:`, err);
        });
    }

    async testTableFetchDataById() {
        const _this = this;
        let id = 6;
        await testD.fetchById(id).then(res => {
            if (res.code == 0) {
                console.log(`通过id(${id})查数据成功`, JSON.stringify(res));
            } else {
                console.log(`通过id(${id})查数据失败`, JSON.stringify(res));
            }
        }).catch(err => {
            console.log(`通过id(${id})查数据失败:`, err);
        });
    }

    async testTableDelById() {
        const _this = this;
        let ids = [3];
        await testD.remove({ ids }).then(res => {
            if (res.code == 0) {
                console.log(`通过ids([${ids[0]}])删除数据成功`);
            } else {
                console.log(`通过ids([${ids[0]}])删除数据失败`);
            }
        }).catch(err => {
            console.log(`通过ids([${ids[0]}])删除数据失败:`, err);
        });
    }

    async testTableFetchAll() {
        const _this = this;
        await testD.fetch().then(res => {
            if (res.code == 0) {
                console.log(`查询全部数据成功`, JSON.stringify(res));
            } else {
                console.log(`查询全部数据失败`, JSON.stringify(res));
            }
        }).catch(err => {
            console.log(`查询全部数据失败:`, err);
        });
    }


    toTree(rows, parent_index) {
        // console.log(data);
        const _this = this;
        const key1 = 'subTaskId'; // 父节点的索引
        const key2 = 'id'; // 自己的索引
        let row = [];

        rows.forEach(el => {
            // console.log(el);
            if (el[key1] == parent_index) {
                el.children = _this.toTree(rows, el[key2]);
                row.push(el);
            }
        });
        return row;
    }
    toRows(tree, result = []) {
        // console.log(data);
        // let row = [];
        const _this = this;
        tree.forEach(el => {
            // console.log(el);
            if (el.children && el.children.length > 0) {
                result.push(el);
                _this.toRows(el.children, result);
            } else {
                result.push(el);
            }
        });
    }
    async task_temp1() {
        const _this = this;
        await taskD.temp1().then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        });
    }
    async task_temp2() {
        const _this = this;
        await taskD.temp2().then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        });
    }


    // betterSqlite3(){
    //     let sql = `CREATE TABLE IF NOT EXISTS 'projects'(
    //         'id' INTEGER PRIMARY KEY NOT NULL,
    //         'old_id' VARCHAR COMMENT '之前使用的id',
    //         'name' VARCHAR COMMENT '名称' NOT NULL,
    //         'status' INT COMMENT '当前状态 0未开始 1正在进行 2已完成' DEFAULT 0,
    //         'describe' VARCHAR COMMENT '描述',
    //         'createTime' BIGINT COMMENT '创建日期 单位s',
    //         'startTime' BIGINT COMMENT '开始日期 单位s',
    //         'completeTime' BIGINT COMMENT '完成日期 单位s',
    //         'estimateTime' REAL COMMENT '预计耗时' DEFAULT 0,
    //         'estUnit' INT COMMENT '预计耗时时间单位 0小时 1天 2月' DEFAULT 0,
    //         'realityTime' BIGINT COMMENT '新改的 实际耗时 排序用 单位s' DEFAULT 0,
    //         'realityTimeTxt' VARCHAR COMMENT '之前使用的实际耗时',
    //         'modifytime' VARCHAR COMMENT '操作时间'
    //     );`;
    //     this.db.exec(sql);

    //     let columns = {};
    //     let params = {
    //         name: "测试1",
    //         describe: "测试11",
    //         estimateTime: 2,
    //         estUnit: 0,
    //     };
    //     for (let k in params) {
    //         columns[k] = params[k];
    //     }
    //     let now = $moment().format('YYYY-MM-DD HH:mm:ss');
    //     columns["modifytime"] = now;
    //     let nowspan = $moment().unix();
    //     columns["createTime"] = nowspan;

    //     sql = $formatSql.insert2({
    //         table: 'projects',
    //         columns,
    //     });
    //     // let stmt = this.db.prepare('INSERT INTO cats (name, age) VALUES (?, ?)');
    //     this.db.exec(sql)

    //     let stmt = this.db.prepare(
    //         "select * from projects;"
    //     );
    //     let obj_photo = stmt.get();// obj_photo 得到的就是查询的结果，已经转换成了对象。
    //     console.log("查询结果:",obj_photo);
    // }
    update(dt) {
        if (this._testNodeCoordinateSystem2) {
            let root_ = cc.find("Canvas/ViewRoot/testNodeCoordinate");
            let root = cc.find("case2", root_);
            root.active = true;

            let scroll = cc.find("scroll", root);

            let mask = cc.find("mask", root);
            let bar = cc.find("bar", mask);
            // cc.log("scroll坐标:", JSON.parse(JSON.stringify(scroll.position)));
            // cc.log("bar坐标:", JSON.parse(JSON.stringify(bar.position)));

            /**https://blog.csdn.net/cui6864520fei000/article/details/89517910 */

            // let node_t = cc.find("temp", scroll);
            // let newPos = bar.parent.convertToNodeSpaceAR(node_t.convertToWorldSpaceAR(cc.Vec2.ZERO));
            // bar.setPosition(newPos.x, newPos.y, 0);


            let newPos = bar.parent.convertToNodeSpaceAR(scroll.convertToWorldSpaceAR(cc.Vec2.ZERO));
            // console.log("node_t节点相对于bar父节点的坐标", JSON.parse(JSON.stringify(newPos)));
            let x = 0;
            let y = (bar.height - scroll.height) / 2

            // 不需要temp节点，把它的坐标当成原点，相应计算就行
            bar.setPosition(newPos.x + x, newPos.y + y, 0);
        }
    }
}
