// console.log('MySqlite.ts 模块被引用了一次 ');
/**
 * 对 SQLiteWrapper 进行promise封装
 */

/**
 * android平台 release模式 Promise reject会报错 unhandledRejectedPromise
 *     https://forum.cocos.org/t/topic/103338/2?u=1550731622
 *       reject(err); 改成  setTimeout(() => reject(err));   
 */
import $Conf from "../config/cfg_index";
if (CC_JSB && cc.sys.isNative) {
    Object.defineProperty(sql.SQLiteStatement, "DataType", {
        writable: false,
        value: {
            INT: 1,
            FLT: 2,
            TXT: 3,
            BLB: 4,
            NUL: 5,
        }
    });
    Object.defineProperty(sql, "TransactionOperation", {
        writable: false,
        value: {
            BEGIN: "begin",
            COMMIT: "commit",
            ROLLBACK: "rollback"
        }
    });
}
export default class MySqlite {

    public transactions = new Map<number, { id: number }>();
    private id_ = 1; // 唯一id 自增
    public get trId() {
        let id_ = this.id_;
        this.id_++;
        // if (this.id_ == 100) {
        //     this.id_ = 1;
        // }
        return id_;
    }

    private static _instance: MySqlite = null;
    public static getInstance() {
        if (MySqlite._instance === null) {
            MySqlite._instance = new MySqlite();
        }
        return MySqlite._instance;
    }

    filename = $Conf.sqlite.filename;
    projname = $Conf.sqlite.projname;
    private _sqlMng = (CC_JSB && cc.sys.isNative) && new sql.SQLiteWrapper() || null;

    isOpen() {
        const _this = this;
        return _this._sqlMng.isOpen();
    }
    /**
     * 打开数据库，并创建链接
     * @returns {Promise<any>} 成功 true ,失败返回 errmsg
     */
    openDB(): Promise<any> {
        const _this = this;
        // console.log("[MySqlite.ts]: openDB ing...");
        return new Promise((resolve, reject) => {
            try {
                let rv = _this._sqlMng.initializing(this.filename, this.projname, "", "", "false");
                if (rv) {
                    // cc.log("[MySqlite.ts]: openDB success");
                    resolve(rv);
                } else {
                    // cc.error("[MySqlite.ts]: openDB error");
                    setTimeout(() => reject(_this._sqlMng.errmsg()));
                    // reject(_this._sqlMng.errmsg());
                }
            } catch (err) {
                // reject(err);
                // cc.error("[MySqlite.ts]: openDB error");
                setTimeout(() => reject(err));
            }
        });
    }
    /**
     * 关闭数据库
     * @returns 成功 true ,失败返回 errmsg
     */
    closeDB(): Promise<any> {
        const _this = this;
        // let result = {
        // 	code: $ErrorCode.SUCCESS,
        // 	msg: '',
        // };
        return new Promise((resolve, reject) => {
            try {
                let rv = _this._sqlMng.close();
                if (rv) {
                    resolve(rv);
                } else {

                    setTimeout(() => reject(_this._sqlMng.errmsg()));
                    // reject(_this._sqlMng.errmsg());
                }
            } catch (err) {
                // reject(err);

                setTimeout(() => reject(err));
            }
        });
    }

    /**
     * 链接数据库（可重新打开并链接）
     * @returns 成功 true ,失败返回 errmsg
     */
    /*
    async connect() {
        // cc.log('connect...');
        const _this = this;
        let isOpen = await _this.isOpen();
        if (isOpen) {
            // _this.closeDB().then(res => {
            // 	cc.log('close sql success');

            // 	_this.openDB().then(res => {
            // 		cc.log('open sql success');
            // 	}).catch(error => {
            // 		cc.error('open sql error');
            // 	});
            // }).catch(error => {
            // 	cc.error('close sql error');
            // });

            // cc.log(JSON.stringify(rv));
        } else {
            await _this.openDB().then(res => {
                cc.log('open sql success');
            }).catch(error => {
                cc.error('open sql error');
            });
        }
    }
    */


    /**
     * 执行增删改等操作的SQL语句
     * 
     * @param {string} sqlStr  必需 需要执行的SQL语句
     * @returns {Promise<any>} 成功 true ,失败返回 errmsg
    */
    executeSql(sqlStr): Promise<any> {
        const _this = this;
        return new Promise((resolve, reject) => {
            try {
                let rv = _this._sqlMng.exec(sqlStr);
                if (rv) {
                    // cc.log("[MySqlite.ts]: executeSql exec sqlstr success! rv:", rv);
                    resolve(rv);
                } else {
                    // cc.error("[MySqlite.ts]: executeSql exec sqlstr failed! rv:", rv);
                    // reject(_this._sqlMng.errmsg());

                    setTimeout(() => reject(_this._sqlMng.errmsg()));
                }
            } catch (err) {
                // cc.error("[MySqlite.ts]: executeSql exec sqlstr failed! catch error:", err);
                // reject(err);

                setTimeout(() => reject(err));
            }
        });
    }
    /**
    * 执行查询操作的SQL语句
    * @param {string} sqlStr  必需 需要执行的SQL语句
    * @returns {Promise<any>} 成功 [{column_key1: column_value1,...} :row] ,失败返回 errmsg
    */

    selectSql(sqlStr): Promise<any> {
        const _this = this;
        return new Promise((resolve, reject) => {
            try {
                let stmt = _this._sqlMng.statement(sqlStr);
                if (!stmt) {
                    // reject(_this._sqlMng.errmsg());

                    setTimeout(() => reject(_this._sqlMng.errmsg()));
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
                    stmt.finalize();
                    stmt = null;
                    resolve(res);
                }
            } catch (err) {
                // reject(err);

                setTimeout(() => reject(err));
            }
        });
    }
    /**
     * 使用事务
     * SQLite 数据库是支持事务的，事务的特性可以保证让某一系列的操作要么全部完成，要么一个都不会完成。
     * 那么在什么情况下才需要使用事务呢？
     * 想象以下场景，比如你正在进行一次转账操作，银行会将转账的金额先从你的账户中扣除，然后再向收款方的账户中添加等量的金额。看上去好像没什么问题吧？可是，如果当你账户中的金额刚刚被扣除，这时由于一些异常原因导致对方收款失败，这一部分钱就凭空消失了！当然银行肯定已经充分考虑到了这种情况，它会保证扣钱和收款的操作要么一起成功，要么都不会成功，而使用的技术当然就是事务了。
     * 
     * 
     * 如果要进行大量的操作，比如要插入10000条数据，如果逐条执行SQL语句，则消耗的时间非常长。采用事务的方式批量处理，可以极大程度提升操作速度(我用1000条记录实验了一下，速度提高了500倍以上)。
     * 
     * 参数：
     * @param { sql.TransactionOperation } operation  必需 需要执行的事务操作
     *       可选值：begin（开始事务）、commit（提交）、rollback（回滚）。
     * @returns {Promise<any>} 成功 true ,失败返回 errmsg
     * 		
     * 使用 ：开启事务 执行逻辑代码 中间如果出错回滚，如果执行完了没错的话就提交  
    * */
    transaction(operation: sql.TransactionOperation): Promise<any> {
        const _this = this;
        return new Promise((resolve, reject) => {
            try {
                let rv = false;
                if (operation === sql.TransactionOperation.BEGIN) {
                    rv = _this._sqlMng.begin();
                } else if (operation === sql.TransactionOperation.COMMIT) {
                    rv = _this._sqlMng.commit();
                } else {
                    rv = _this._sqlMng.rollback();
                }

                if (rv) {
                    resolve(rv);
                } else {
                    // reject(_this._sqlMng.errmsg());

                    setTimeout(() => reject(_this._sqlMng.errmsg()));
                }
            } catch (err) {
                // reject(err);
                setTimeout(() => reject(err));
            }
        });
    }

}
