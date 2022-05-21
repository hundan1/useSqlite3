/* 
    Config 数据接口层
 */
import DBI from '../../utils/SqliteBase';
import $ErrorCode from '../../utils/errorcode';
import $formatSql from '../../utils/formatSql';
import * as $moment from "moment";


export default class ConfigDBIClass extends DBI {
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
            let sqlStr = `DROP TABLE IF EXISTS 'config'`;
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
                        CREATE TABLE IF NOT EXISTS 'config'(
                            'id' INTEGER PRIMARY KEY NOT NULL,
                            'name' VARCHAR COMMENT '参数名称' NOT NULL,
                            'value' VARCHAR COMMENT '参数值' DEFAULT 0,
                            'describe' VARCHAR COMMENT '描述',
                            'modifytime' VARCHAR COMMENT '操作时间'
                        );`;
                result = await _this.execute(sqlStr);
            }

        } catch (e) {
            cc.error('config dbi createTable error:', e);
        } finally {
            return result;
        }
    }
    // 查询配置信息
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

            // let columns = ['p.*'];别名 SELECT p.field1,t.field2 FROM 'config' p,'tasks' t
            // DESC 降序-1 ASC升序1
            // ORDER BY `checktime` DESC,c.checkId DESC
            let sqlStr = "";
            if (limit > 0) {
                // 限数查 总数通过count得到
                // sqlite interface count()使用要改
                // 1.提前获取总数 可能有searchs
                sqlStr = `SELECT count(*) FROM 'config'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ';';
                let rv1 = await _this.selectSql(sqlStr);
                if (rv1.code == $ErrorCode.SUCCESS) {
                    let total = rv1.rows[0]["count(*)"];

                    // 2.根据需要返回数据
                    let columnsTxt = columns.join(", ");
                    sqlStr = `SELECT ${columnsTxt} FROM 'config'`;
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
                sqlStr = `SELECT ${columnsTxt} FROM 'config'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ` ORDER BY 'id' ASC`;
                sqlStr += ';';
                result = await _this.selectSql(sqlStr);
            }



        } catch (e) {
            cc.error('config dbi get error:', e);
        } finally {
            return result;
        }
    }
    // 添加配置参数
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
                table: 'config',
                columns,
            });

            result = await _this.execute(sqlStr);
            // let rv = await _this.execute(sqlStr);
            // result.code = rv.code;
            // result.rows = rv.code;

        } catch (e) {
            cc.error('config dbi add error:', e);
        } finally {
            return result;
        }
    }

    // 通过id查询配置参数
    async fetchById(id) {

        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            total: 0
        };
        try {
            let sqlStr = `SELECT * FROM 'config' WHERE id = ${id} ORDER BY 'id' ASC;`;
            result = await _this.selectSql(sqlStr);

        } catch (e) {
            cc.error('config dbi fetchById error:', e);
        } finally {
            return result;
        }
    }
    // 通过参数名<name UNIQUE>设置参数
    async set(params: { name: string, value?: string, describe?: string } = { name: "" }, trId = null) {

        const _this = this;
        let result = {
            code: $ErrorCode.SET_FAILED,
        };
        try {
            let columns = {};
            for (let k in params) {
                columns[k] = params[k];
            }
            let now = $moment().format('YYYY-MM-DD HH:mm:ss');
            columns["modifytime"] = now;

            // cc.log("config dbi set columns:", columns);

            let sqlStr = `INSERT INTO 'config' (${Object.keys(columns).join(",")}) VALUES (${Object.keys(columns).map(k => (isNaN(columns[k]) ? ("\"" + columns[k] + "\"") : columns[k])).join(",")}) ON CONFLICT(name) DO UPDATE SET ${Object.keys(columns).map(k => (k + " = " + (isNaN(columns[k]) ? ("\"" + columns[k] + "\"") : columns[k]))).join(",")}`;


            result = await _this.execute(sqlStr, trId);

        } catch (e) {
            cc.error('config dbi set error:', e);
        } finally {
            return result;
        }
    }
    // 通过id设置参数
    async setById(params: { id: number } = { id: -1 }) {

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
                table: 'config',
                columns,
                whereRow,
            });
            result = await _this.execute(sqlStr);

        } catch (e) {
            cc.error('config dbi setById error:', e);
        } finally {
            return result;
        }
    }
    /**
     * 删除配置参数
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
            // 1. 删除配置参数
            let whereRow = '';
            if (ids.length == 1) {
                whereRow = `WHERE id = ${ids[0]}`;
            } else {
                let ids_ = ids.join(', ');
                whereRow = `WHERE id IN ( ${ids_} )`;
            }

            let sqlStr = $formatSql.delete1({
                table: 'config',
                whereRow,
            });
            // cc.log('del config sqlStr:', sqlStr);
            let rv1 = await _this.execute(sqlStr, trId);
            if (rv1.code != $ErrorCode.SUCCESS) {
                result.msg = 'del config error';
                let rv_error = new Error('del config error');
                throw rv_error;
            }
            result.code = rv1.code;
            await _this.transaction(sql.TransactionOperation.COMMIT, trId); //提交事务
        } catch (e) {
            await _this.transaction(sql.TransactionOperation.ROLLBACK, trId); //回滚事务
            cc.error('config dbi remove error:', e);
        } finally {
            return result;
        }
    }
    // 查询配置参数
    async fetch() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: []
        };
        try {
            let columns = ['*'];
            let sqlStr = $formatSql.select1({
                table: 'config',
                columns
            });
            result = await _this.selectSql(sqlStr);

        } catch (e) {
            cc.error('config dbi fetch error:', e);
        } finally {
            return result;
        }
    }

}
