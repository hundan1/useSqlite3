/* 
    Test 数据接口层
 */
import DBI from '../../utils/SqliteBase';
import $ErrorCode from '../../utils/errorcode';
import $formatSql from '../../utils/formatSql';

import * as $moment from "moment";

export default class TestDBIClass extends DBI {
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
            let sqlStr = `DROP TABLE IF EXISTS 'tests'`;
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
                sqlStr = `CREATE TABLE IF NOT EXISTS 'tests'(
                    'id' INTEGER PRIMARY KEY NOT NULL,
                    'str' VARCHAR COMMENT '文本测试' NOT NULL,
                    'number' INT COMMENT '数字测试' DEFAULT 0,
                    'modifytime' VARCHAR COMMENT '操作时间'
                    );`;
                result = await _this.execute(sqlStr);
            }

        } catch (err) {
            cc.error('tests dbi createTable error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

    // 查询
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
                sqlStr = `SELECT count(*) FROM 'tests'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ';';
                let rv1 = await _this.selectSql(sqlStr);
                if (rv1.code == $ErrorCode.SUCCESS) {
                    let total = rv1.rows[0]["count(*)"];

                    // 2.根据需要返回数据
                    let columnsTxt = columns.join(", ");
                    sqlStr = `SELECT ${columnsTxt} FROM 'tests'`;
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
                sqlStr = `SELECT ${columnsTxt} FROM 'tests'`;
                if (whereRow) {
                    sqlStr += ` ${whereRow}`;
                }
                sqlStr += ` ORDER BY 'id' ASC`;
                sqlStr += ';';
                result = await _this.selectSql(sqlStr);
            }



        } catch (err) {
            cc.error('tests dbi get error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }
    // 添加
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
            // cc.log("tests dbi add 1 params:", JSON.stringify(params));
            for (let k in params) {
                columns[k] = params[k];
            }
            // cc.log("tests dbi add 2 columns:", JSON.stringify(columns));

            let now = $moment().format('YYYY-MM-DD HH:mm:ss');
            // let now;
            // try {
            //     now = $moment().format('YYYY-MM-DD HH:mm:ss');
            // } catch (err) {
            //     console.log("$moment error: ", JSON.stringify(err));
            // }
            // cc.log("tests dbi add 3 now:", now);
            columns["modifytime"] = now;
            // cc.log("tests dbi add 4 columns:", JSON.stringify(columns));

            let sqlStr = $formatSql.insert2({
                table: 'tests',
                columns,
            });

            // cc.log("tests dbi add 5 exec sqlstr:", sqlStr);

            result = await _this.execute(sqlStr);
            // let rv = await _this.execute(sqlStr);
            // result.code = rv.code;
            // result.rows = rv.code;

        } catch (err) {
            cc.error('tests dbi add error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

    // 通过id查询
    async fetchById(id) {

        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            total: 0
        };
        try {
            let sqlStr = `SELECT * FROM 'tests' WHERE id = ${id} ORDER BY 'id' ASC;`;
            result = await _this.selectSql(sqlStr);

        } catch (err) {
            cc.error('tests dbi fetchById error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }
    // 通过id修改
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

            cc.log("tests dbi add sqlstr columns:", JSON.stringify(columns));
            let sqlStr = $formatSql.update1({
                table: 'tests',
                columns,
                whereRow,
            });
            cc.log("tests dbi set exec sqlstr:", sqlStr);

            result = await _this.execute(sqlStr);

        } catch (err) {
            cc.error('tests dbi set error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }
    /**
     * 删除
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
                table: 'tests',
                whereRow,
            });
            // cc.log('del tests sqlStr:', sqlStr);
            let rv1 = await _this.execute(sqlStr, trId);
            if (rv1.code != $ErrorCode.SUCCESS) {
                result.msg = 'del tests error';
                let rv_error = new Error('del tests error');
                throw rv_error;
            }
            result.code = rv1.code;

            // 2. 删除项目下的任务
            // whereRow = '';
            // if (ids.length == 1) {
            //     whereRow = `WHERE proId = ${ids[0]}`;
            // } else {
            //     let ids_ = ids.join(', ');
            //     whereRow = `WHERE proId IN ( ${ids_} )`;
            // }
            // sqlStr = $formatSql.delete1({
            //     table: 'tasks',
            //     whereRow,
            // });
            // // let error_test = new Error('test');
            // // throw error_test;
            // // cc.log('del tasks sqlStr:', sqlStr);
            // let rv2 = await _this.execute(sqlStr, trId);
            // if (rv2.code != $ErrorCode.SUCCESS) {
            //     result.msg = 'del tasks error';
            //     let rv_error = new Error('del tasks error');
            //     throw rv_error;
            // }
            // result.code = rv2.code;
            await _this.transaction(sql.TransactionOperation.COMMIT, trId); //提交事务
        } catch (err) {
            await _this.transaction(sql.TransactionOperation.ROLLBACK, trId); //回滚事务
            cc.error('tests dbi remove error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }
    // 查询
    async fetch() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: []
        };
        try {
            let columns = ['*'];
            let sqlStr = $formatSql.select1({
                table: 'tests',
                columns
            });
            result = await _this.selectSql(sqlStr);

        } catch (err) {
            cc.error('tests dbi fetch error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

}
