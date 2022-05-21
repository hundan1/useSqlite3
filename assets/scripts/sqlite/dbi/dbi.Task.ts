/* 
    Task 数据接口层
 */
import DBI from '../../utils/SqliteBase';
import $ErrorCode from '../../utils/errorcode';
import $formatSql from '../../utils/formatSql';
import * as $moment from "moment";
export default class TaskDBIClass extends DBI {
    constructor() {
        super(); //调用此方法,this才用可以用,代表父类的构造函数，返回的却是子类
    }
    /**
     * 建表
     * */
    async createTable() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            // rows: []
        };
        try {
            let sqlStr = `DROP TABLE IF EXISTS 'tasks'`;
            result = await _this.execute(sqlStr);
            // cc.log('result:',result);
            if (result.code == $ErrorCode.SUCCESS) {
                sqlStr =
                    `
                        CREATE TABLE IF NOT EXISTS 'tasks'(
                            'id' INTEGER PRIMARY KEY NOT NULL,
                            'old_id' VARCHAR COMMENT '之前使用的id',
                            'name' VARCHAR COMMENT '名称' NOT NULL,
                            'describe' VARCHAR COMMENT '描述',
                            'status' INT COMMENT '当前状态 0未开始 1正在进行 2已完成' DEFAULT 0,
                            'category' INT COMMENT '类型：0 新增需求 1 项目优化 2 修复bug',
                            'proId' INT COMMENT '对应的项目id' NOT NULL,
                            'old_proId' VARCHAR COMMENT '之前使用的对应的项目id',
                            'parentId' INT COMMENT '上级任务id 0为顶级任务' DEFAULT 0,
                            'old_parentId' VARCHAR COMMENT '之前使用的上级任务id',
                            'rootId' INT COMMENT '根任务id 0为顶级任务' DEFAULT 0,
                            'createTime' BIGINT COMMENT '创建日期 单位s',
                            'startTime' BIGINT COMMENT '开始日期 单位s',
                            'completeTime' BIGINT COMMENT '完成日期 单位s',
                            'estimateTime' REAL COMMENT '预计耗时' DEFAULT 0,
                            'estUnit' INT COMMENT '预计耗时时间单位 0小时 1天 2月' DEFAULT 0,
                            'realityTime' BIGINT COMMENT '新改的 实际耗时 排序用 单位s' DEFAULT 0,
                            'realityTimeTxt' VARCHAR COMMENT '之前使用的实际耗时',
                            'modifytime' VARCHAR COMMENT '操作时间'
                        );`;
                result = await _this.execute(sqlStr);
            }

        } catch (e) {
            cc.error('task dbi createTable error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 支持分页查询任务
     * */
    async get({
        offset = 0,
        limit = 0,
        columns = ['*'],
        searchs = {},
        whereRow = '',
        sorts = [{
            'id': 1
        }],
        trId = null
    } = {}) {

        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            total: 0
        };
        try {

            // let columns = ['p.*'];别名 SELECT p.field1,t.field2 FROM 'projects' p,'tasks' t
            // DESC 降序-1 ASC升序1
            // ORDER BY `checktime` DESC,c.checkId DESC
            let sqlStr = "";
            if (limit > 0) {
                // 限数查 总数通过count得到
                // sqlite interface count()使用要改
                // 1.提前获取总数 可能有searchs
                sqlStr = `SELECT count(*) FROM 'tasks'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ';';
                let rv1 = await _this.selectSql(sqlStr, trId);
                if (rv1.code == $ErrorCode.SUCCESS) {
                    let total = rv1.rows[0]["count(*)"];

                    // 2.根据需要返回数据
                    let columnsTxt = columns.join(", ");
                    sqlStr = `SELECT ${columnsTxt} FROM 'tasks'`;
                    if (whereRow) {
                        sqlStr += ` ${whereRow}`;
                    }
                    sqlStr += ` ORDER BY 'id' ASC`;
                    sqlStr += ` LIMIT ${limit} OFFSET ${offset}`;
                    sqlStr += ';';
                    result = await _this.selectSql(sqlStr, trId);
                    if (result.code == $ErrorCode.SUCCESS) {
                        result.total = total;
                    }
                }


            } else {
                let columnsTxt = columns.join(", ");
                sqlStr = `SELECT ${columnsTxt} FROM 'tasks'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ` ORDER BY 'id' ASC`;
                sqlStr += ';';
                result = await _this.selectSql(sqlStr, trId);
            }



        } catch (e) {
            cc.error('task dbi get error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 添加任务
     * */
    async add(params = {}) {

        const _this = this;
        let result = {
            code: $ErrorCode.ADD_FAILED,
            // id: -1,
        };
        try {
            let columns = {};
            for (let k in params) {
                columns[k] = params[k];
            }
            let now = $moment().format('YYYY-MM-DD HH:mm:ss');
            columns["modifytime"] = now;

            let sqlStr = $formatSql.insert2({
                table: 'tasks',
                columns,
            });
            result = await _this.execute(sqlStr);

        } catch (e) {
            cc.error('task dbi add error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 通过id编辑任务
     * */
    async set(params: { id: number } = { id: -1 }) {

        const _this = this;
        let result = {
            code: $ErrorCode.SET_FAILED,
        };
        try {
            let columns = {};
            for (let k in params) {
                if (k == 'id') {
                    continue;
                }
                columns[k] = params[k];
            }
            let now = $moment().format('YYYY-MM-DD HH:mm:ss');
            columns["modifytime"] = now;

            let whereRow = `WHERE id = ${params.id}`;

            let sqlStr = $formatSql.update1({
                table: 'tasks',
                columns,
                whereRow,
            });
            result = await _this.execute(sqlStr);

        } catch (e) {
            cc.error('task dbi set error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 删除任务
     * */
    async remove({
        ids = []
    } = {
            ids: []
        }) {
        const _this = this;
        let result: { code: number, msg?} = {
            code: $ErrorCode.DEL_FAILED,
            msg: "",
        };
        let trId = 0;
        try {
            let rv = null;
            rv = await _this.transaction(sql.TransactionOperation.BEGIN); //开启事务
            if (rv.code == $ErrorCode.SUCCESS) {
                trId = rv.trId;
            } else {
                return;
            }

            let whereRow = '';
            let taskIds = [];
            rv = await _this.get({ columns: ['id', 'name', 'parentId', 'rootId'], trId });
            if (rv.code != $ErrorCode.SUCCESS) {
                result.code = $ErrorCode.DB_FAILED;
                result.msg = 'fetch all tasks error';
                return result;
            }
            let allTasks = rv.rows;
            // 遍历拿对应项目下的子任务索引
            for (let i = 0; i < ids.length; i++) {
                let id = parseInt(ids[i]); // split方法拿到的是字符串
                let childIds = await _this.recursionChildTaskIds({
                    parentTaskId: id,
                    tasks: allTasks
                });
                // cc.log('childIds:',childIds);
                taskIds.push(id);
                taskIds = taskIds.concat(childIds);
            }
            let taskIdsSet = new Set<number>(taskIds); // 防止传过来的ids有层级关系
            // let ids_ = [...taskIdsSet].join(', ');
            let ids_ = [...Array.from(taskIdsSet)].join(', ');
            whereRow = `WHERE id IN ( ${ids_} )`;
            let sqlStr = $formatSql.delete1({
                table: 'tasks',
                whereRow,
            });
            // cc.log('remove sqlStr:', sqlStr);
            // let error_test = new Error('test');
            // throw error_test;
            result = await _this.execute(sqlStr, trId);
            if (result.code != $ErrorCode.SUCCESS) {
                let rv_error = new Error('del task error');
                throw rv_error;
            }
            await _this.transaction(sql.TransactionOperation.COMMIT, trId); //提交事务
        } catch (e) {
            await _this.transaction(sql.TransactionOperation.ROLLBACK, trId); //回滚事务
            cc.error('task dbi remove error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 递归获取某个任务的所有子任务索引
     * @param {object} params
     * @param {number} params.parentTaskId 任务索引
     * @param {array} params.tasks 所有任务
     */
    async recursionChildTaskIds({
        parentTaskId,
        tasks
    }) {
        // cc.log('parentTaskId:',parentTaskId);
        // cc.log('tasks:',JSON.stringify(tasks));
        let ids = [];
        const key1 = 'parentId';
        const key2 = 'id';
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            if (task[key1] == parentTaskId) {
                let childIds = await this.recursionChildTaskIds({
                    parentTaskId: task[key2],
                    tasks
                });
                ids.push(task[key2]);
                if (childIds.length > 0) {
                    ids = ids.concat(childIds);
                }
            }
        }

        return ids;
    }

    // 查询记录
    async fetch() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            total: 0,
        };
        try {
            let columns = ['*'];
            let sqlStr = $formatSql.select1({
                table: 'tasks',
                columns
            });
            result = await _this.selectSql(sqlStr);

        } catch (e) {
            cc.error('task dbi fetch error:', e);
        } finally {
            return result;
        }
    }
    // 插入记录temp_add 批量数据导入 任务临时用
    async temp_add(values) {
        const _this = this;
        let result = {
            code: $ErrorCode.ADD_FAILED,
            // rows: []
        };
        try {
            //  'parentId', 'rootId',
            let columns = ['old_id', 'name', 'describe', 'status', 'category', 'proId', 'old_proId', 'old_parentId',
                'createTime', 'startTime', 'completeTime', 'estimateTime', 'estUnit', 'realityTime', 'realityTimeTxt',
                'modifytime'
            ];
            let sqlStr = $formatSql.insert1({
                table: 'tasks',
                columns,
                values
            });
            result = await _this.execute(sqlStr);
            // cc.log('result:',result);

        } catch (e) {
            cc.error('task dbi temp_add error:', e);
        } finally {
            return result;
        }
    }
    // 临时使用 localstorage -> db 
    // task old_proId -> proId
    async temp1() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: []
        };
        try {
            // 1. 将projects 中所有数据拿过来（只要id 和 old_id）
            let sqlStr = $formatSql.select1({
                table: 'projects',
                columns: ['id', 'old_id'],
            });
            let rv1 = await _this.selectSql(sqlStr);
            if (rv1.code == $ErrorCode.SUCCESS) {
                // rows->obj 数组转对象方便使用
                let projects = {};
                // rv1.rows.map(el=>{
                // 	projects[el.old_id] = el.id;
                // })
                // x 将tasks 中所有数据拿过来（只要id 和 old_proId）
                // sqlStr = $formatSql.select1({
                // 	table: 'tasks',
                // 	columns: ['id', 'old_proId'],
                // });
                // result = await _this.selectSql(sqlStr);

                // 2. 批量更新 tasks old_proId -> proId


                // !!!rv1.rows.forEach是异步的,改成for
                // rv1.rows.forEach(async (el) => {
                //     sqlStr = `UPDATE tasks SET proId = ${el.id} WHERE old_proId = '${el.old_id}';`;
                //     await _this.execute(sqlStr);

                // });


                for (let i = 0; i < rv1.rows.length; i++) {
                    let el = rv1.rows[i];
                    sqlStr = `UPDATE tasks SET proId = ${el.id} WHERE old_proId = '${el.old_id}';`;
                    await _this.execute(sqlStr);
                }
                result.code = $ErrorCode.SUCCESS;
            }


        } catch (e) {
            cc.error('task dbi add error:', e);
        } finally {
            return result;
        }
    }
    // 临时使用 localstorage -> db
    // task old_parentId -> parentId
    async temp2() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: []
        };
        try {
            // 1. 将tasks 中所有数据拿过来（只要id 和 old_id）
            let sqlStr = $formatSql.select1({
                table: 'tasks',
                columns: ['id', 'old_id', 'old_parentId'],
            });
            let rv1 = await _this.selectSql(sqlStr);
            if (rv1.code == $ErrorCode.SUCCESS) {
                // rows->obj 数组转对象方便使用
                let tasks = {};
                rv1.rows.map(el => {
                    tasks[el.old_id] = el.id;
                });
                // cc.log(JSON.stringify(tasks));
                // x 将tasks 中所有数据拿过来（只要id 和 old_proId）
                // sqlStr = $formatSql.select1({
                // 	table: 'tasks',
                // 	columns: ['id', 'old_proId'],
                // });
                // result = await _this.selectSql(sqlStr);

                // 2. 批量更新 tasks old_parentId -> parentId

                // !!!rv1.rows.forEach是异步的,改成for
                // rv1.rows.forEach(async (el) => {
                //     if (el.old_parentId != "0") {
                //         // cc.log(el.old_parentId,tasks[el.old_parentId]);
                //         sqlStr =
                //             `UPDATE tasks SET parentId = ${tasks[el.old_parentId]}, rootId = ${tasks[el.old_parentId]} WHERE id = '${el.id}';`;
                //         await _this.execute(sqlStr);
                //     }
                // });

                for (let i = 0; i < rv1.rows.length; i++) {
                    let el = rv1.rows[i];
                    
                    if (el.old_parentId != "0") {
                        // cc.log(el.old_parentId,tasks[el.old_parentId]);
                        sqlStr =
                            `UPDATE tasks SET parentId = ${tasks[el.old_parentId]}, rootId = ${tasks[el.old_parentId]} WHERE id = '${el.id}';`;
                        await _this.execute(sqlStr);
                    }
                }

                result.code = $ErrorCode.SUCCESS;

            }


        } catch (e) {
            cc.error('task dbi add error:', e);
        } finally {
            return result;
        }
    }
}
