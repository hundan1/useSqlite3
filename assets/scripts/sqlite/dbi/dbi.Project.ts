/* 
    Project 数据接口层
 */
import DBI from '../../utils/SqliteBase';
import $ErrorCode from '../../utils/errorcode';
import $formatSql from '../../utils/formatSql';
import TaskDBI from './dbi.Task';
import * as $moment from "moment";

const taskDBI = new TaskDBI();
export default class ProjectDBIClass extends DBI {
    constructor() {
        super(); //调用此方法,this才用可以用,代表父类的构造函数，返回的却是子类
    }
    // 建表
    async createTable() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            // rows: []
        };
        try {
            let sqlStr = `DROP TABLE IF EXISTS 'projects'`;
            result = await _this.execute(sqlStr);
            // cc.log('result:',result);
            if (result.code == $ErrorCode.SUCCESS) {
                // let now = new Date();
                // AUTOINCREMENT x AUTO_INCREMENT √ but 无效
                // INT INTEGER
                // PRIMARY KEY ,PRIMARY KEY ( 'id' )
                // 'id' INTEGER AUTO_INCREMENT COMMENT '索引id' PRIMARY KEY x
                // 'id' INTEGER COMMENT '索引id' PRIMARY KEY x 字段值位置错了也不行
                // 'id' INTEGER COMMENT '索引id' PRIMARY KEY NOT NULL x but insert null error NOT NULL
                // 'id' INTEGER PRIMARY KEY NOT NULL COMMENT '索引id' x
                // 'id' INTEGER PRIMARY KEY COMMENT '索引id' NOT NULL x
                // 'id' INTEGER PRIMARY KEY NOT NULL √
                // 'id' INTEGER PRIMARY KEY √
                sqlStr = `
                        CREATE TABLE IF NOT EXISTS 'projects'(
                            'id' INTEGER PRIMARY KEY NOT NULL,
                            'old_id' VARCHAR COMMENT '之前使用的id',
                            'name' VARCHAR COMMENT '名称' NOT NULL,
                            'status' INT COMMENT '当前状态 0未开始 1正在进行 2已完成' DEFAULT 0,
                            'describe' VARCHAR COMMENT '描述',
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
            cc.error('project dbi createTable error:', e);
        } finally {
            return result;
        }
    }
    // 查询项目
    async get({
        offset = 0,
        limit = 0,
        columns = ['*'],
        searchs = {},
        whereRow = '',
        sorts = [{ 'id': 1 }],
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
                sqlStr = `SELECT count(*) FROM 'projects'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ';';
                let rv1 = await _this.selectSql(sqlStr);
                if (rv1.code == $ErrorCode.SUCCESS) {
                    let total = rv1.rows[0]["count(*)"];

                    // 2.根据需要返回数据
                    let columnsTxt = columns.join(", ");
                    sqlStr = `SELECT ${columnsTxt} FROM 'projects'`;
                    if (whereRow) {
                        sqlStr += ` ${whereRow}`;
                    }
                    sqlStr += ` ORDER BY 'id' ASC`;
                    sqlStr += ` LIMIT ${limit} OFFSET ${offset}`;
                    sqlStr += ';';
                    result = await _this.selectSql(sqlStr);
                    if (result.code == $ErrorCode.SUCCESS) {
                        result.total = total;
                    }
                }


            } else {
                let columnsTxt = columns.join(", ");
                sqlStr = `SELECT ${columnsTxt} FROM 'projects'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ` ORDER BY 'id' ASC`;
                sqlStr += ';';
                result = await _this.selectSql(sqlStr);
            }



        } catch (e) {
            cc.error('project dbi get error:', e);
        } finally {
            return result;
        }
    }
    // 添加项目
    async add(params = {}) {

        const _this = this;
        // let result: { code: number, id: number, rows?} = {
        //     code: $ErrorCode.ADD_FAILED,
        //     id: -1,
        // };
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
            let nowspan = $moment().unix();
            columns["createTime"] = nowspan;

            let sqlStr = $formatSql.insert2({
                table: 'projects',
                columns,
            });

            result = await _this.execute(sqlStr);
            // let rv = await _this.execute(sqlStr);
            // result.code = rv.code;
            // result.rows = rv.code;

        } catch (e) {
            cc.error('project dbi add error:', e);
        } finally {
            return result;
        }
    }

    // 通过id查询项目
    async fetchById(id) {

        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            total: 0
        };
        try {
            let sqlStr = `SELECT * FROM 'projects' WHERE id = ${id} ORDER BY 'id' ASC;`;
            result = await _this.selectSql(sqlStr);

        } catch (e) {
            cc.error('project dbi fetchById error:', e);
        } finally {
            return result;
        }
    }
    // 通过id编辑项目
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
                table: 'projects',
                columns,
                whereRow,
            });
            result = await _this.execute(sqlStr);

        } catch (e) {
            cc.error('project dbi set error:', e);
        } finally {
            return result;
        }
    }
    /**
     * 删除项目
     * */
    async remove({ ids = [] } = { ids: [] }) {
        const _this = this;
        let result = {
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
            // 1. 删除项目
            let whereRow = '';
            if (ids.length == 1) {
                whereRow = `WHERE id = ${ids[0]}`;
            } else {
                let ids_ = ids.join(', ');
                whereRow = `WHERE id IN ( ${ids_} )`;
            }

            let sqlStr = $formatSql.delete1({
                table: 'projects',
                whereRow,
            });
            // cc.log('del pros sqlStr:', sqlStr);
            let rv1 = await _this.execute(sqlStr, trId);
            if (rv1.code != $ErrorCode.SUCCESS) {
                result.msg = 'del pros error';
                let rv_error = new Error('del pros error');
                throw rv_error;
            }
            // 2. 删除项目下的任务
            whereRow = '';
            if (ids.length == 1) {
                whereRow = `WHERE proId = ${ids[0]}`;
            } else {
                let ids_ = ids.join(', ');
                whereRow = `WHERE proId IN ( ${ids_} )`;
            }
            sqlStr = $formatSql.delete1({
                table: 'tasks',
                whereRow,
            });
            // let error_test = new Error('test');
            // throw error_test;
            // cc.log('del tasks sqlStr:', sqlStr);
            let rv2 = await _this.execute(sqlStr, trId);
            if (rv2.code != $ErrorCode.SUCCESS) {
                result.msg = 'del tasks error';
                let rv_error = new Error('del tasks error');
                throw rv_error;
            }
            result.code = rv2.code;
            await _this.transaction(sql.TransactionOperation.COMMIT, trId); //提交事务
        } catch (e) {
            await _this.transaction(sql.TransactionOperation.ROLLBACK, trId); //回滚事务
            cc.error('project dbi remove error:', e);
        } finally {
            return result;
        }
    }
    // 查询记录
    async fetch() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: []
        };
        try {
            let columns = ['*'];
            let sqlStr = $formatSql.select1({
                table: 'projects',
                columns
            });
            result = await _this.selectSql(sqlStr);

        } catch (e) {
            cc.error('project dbi fetch error:', e);
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
            let columns = ['old_id', 'name', 'status', 'describe', 'createTime', 'startTime', 'completeTime', 'estimateTime', 'estUnit', 'realityTime', 'realityTimeTxt', 'modifytime'];
            let sqlStr = $formatSql.insert1({
                table: 'projects',
                columns,
                values
            });
            result = await _this.execute(sqlStr);
            // cc.log('result:',result);

        } catch (e) {
            cc.error('project dbi temp_add error:', e);
        } finally {
            return result;
        }
    }

}
