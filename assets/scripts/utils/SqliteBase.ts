import MySqlite from './MySqlite';

import $ErrorCode from "./errorcode";
export default class SqliteBase {
    /**
     * 执行数据库语句
     * @param {string} sqlStr 数据库语句 
     * @param {number} trId 事务id 有该事务，语句执行完不关闭数据库，无，关闭数据库
     * */
    async execute(sqlStr, trId = null) {
        let result = {
            code: $ErrorCode.DB_FAILED,
            // rows: []
        };
        let _this = this;
        try {
            let hasTr = trId !== null && MySqlite.getInstance().transactions.has(trId) || false;

            cc.log("hasTr:", hasTr, "transactions:", MySqlite.getInstance().transactions, "trId:", trId);
            let isOpen = await MySqlite.getInstance().isOpen(); // 判断sql链接是否断开
            // console.log("数据库是否已经打开: ", isOpen);
            if (isOpen) {
                await MySqlite.getInstance().executeSql(sqlStr).then(res => {
                    cc.log(`[SqliteBase.ts]: sql语句:${sqlStr}执行成功;`, res);
                    result.code = $ErrorCode.SUCCESS;
                    // result.rows = res;
                    // cc.log('20',result);
                }).catch(err => {
                    cc.error(`[SqliteBase.ts]: sql语句:${sqlStr}语句执行错误;`, JSON.stringify(err));
                });
                if (!hasTr) {
                    await _this.closeDB();
                }
            } else {
                // cc.log('sql链接断开,重连ing...');
                cc.log('[SqliteBase.ts]: 数据库已关闭,重新打开,opening...');
                // sql链接断开，重连
                await MySqlite.getInstance().openDB().then(async res => {
                    cc.log('[SqliteBase.ts]: 数据库重新打开成功', res);
                    await MySqlite.getInstance().executeSql(sqlStr).then(res => {
                        cc.log(`[SqliteBase.ts]: sql语句:${sqlStr}执行成功;`, res);
                        result.code = $ErrorCode.SUCCESS;
                        // result.rows = res;
                        // cc.log('33',result);
                    }).catch(err => {
                        cc.error(`[SqliteBase.ts]: sql语句:${sqlStr}语句执行错误;`, JSON.stringify(err));
                    });
                }).catch(err => {
                    cc.error('[SqliteBase.ts]: 数据库重新打开失败', err);
                });
                if (!hasTr) {
                    await _this.closeDB();
                }
            }
        } catch (err) {
            cc.error('[SqliteBase.ts]: error:', err);
        } finally {
            cc.log('[SqliteBase.ts]: result:', JSON.stringify(result));
            return result;
        }

    }

    /**
     * 执行数据库语句
     * @param {string} sqlStr 数据库语句 
     * @param {number} trId 事务id 有该事务，语句执行完不关闭数据库，无，关闭数据库
     * */
    async selectSql(sqlStr, trId = null) {
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            total: 0
        };
        let _this = this;
        try {
            let hasTr = trId !== null && MySqlite.getInstance().transactions.has(trId) || false;
            cc.log("hasTr:", hasTr, "transactions:", MySqlite.getInstance().transactions, "trId:", trId);

            let isOpen = await MySqlite.getInstance().isOpen(); // 判断sql链接是否断开
            if (isOpen) {
                await MySqlite.getInstance().selectSql(sqlStr).then(res => {
                    cc.log(`[SqliteBase.ts]: sql语句:${sqlStr}执行成功;`, res);
                    result.code = $ErrorCode.SUCCESS;
                    result.rows = res;
                    result.total = res.length;
                    // cc.log('61',result);
                }).catch(err => {
                    cc.error(`[SqliteBase.ts]: sql语句:${sqlStr}语句执行错误;`, JSON.stringify(err));
                });
                if (!hasTr) {
                    await _this.closeDB();
                }
            } else {
                cc.log('[SqliteBase.ts]: 数据库已关闭,重新打开,opening...');
                // sql链接断开，重连
                await MySqlite.getInstance().openDB().then(async res => {
                    cc.log('[SqliteBase.ts]: 数据库重新打开成功', res);
                    await MySqlite.getInstance().selectSql(sqlStr).then(res => {
                        cc.log(`[SqliteBase.ts]: sql语句:${sqlStr}执行成功;`, res);
                        result.code = $ErrorCode.SUCCESS;
                        result.rows = res;
                        result.total = res.length;
                        // cc.log('74',result);
                    }).catch(err => {
                        cc.error(`[SqliteBase.ts]: sql语句:${sqlStr}语句执行错误;`, JSON.stringify(err));
                    });
                    if (!hasTr) {
                        await _this.closeDB();
                    }
                }).catch(err => {
                    cc.error('[SqliteBase.ts]: 数据库重新打开失败', err);
                });
            }
        } catch (err) {
            cc.error('[SqliteBase.ts]: error:', err);
        } finally {
            cc.log('[SqliteBase.ts]: result:', JSON.stringify(result));
            return result;
        }

    }
    /**
     * 事务操作
     * @param {string} [operation= sql.TransactionOperation.BEGIN] 操作（可选值: 'begin','commit','rollback'）
     * @param {number} trId 事务id
     * */
    async transaction(operation = sql.TransactionOperation.BEGIN, trId = 0) {
        let result: {
            code: number,
            trId?: number
        } = {
            code: $ErrorCode.DB_FAILED,
        };
        let _this = this;
        try {
            let tips = {
                begin: {
                    0: '开启事务失败',
                    1: '开启事务成功',
                },
                commit: {
                    0: '提交事务失败',
                    1: '提交事务成功',
                },
                rollback: {
                    0: '回滚事务失败',
                    1: '回滚事务成功',
                },
            }
            let isOpen = await MySqlite.getInstance().isOpen(); // 判断sql链接是否断开
            if (isOpen) {
                await MySqlite.getInstance().transaction(operation).then(res => {
                    cc.log(`[SqliteBase.ts]: ${tips[operation][1]};`, JSON.stringify(res));
                    result.code = $ErrorCode.SUCCESS;
                    // cc.log('61',result);
                }).catch(err => {
                    cc.error(`${tips[operation][0]};`, JSON.stringify(err));
                });
                if (operation != sql.TransactionOperation.BEGIN) {
                    await _this.closeDB();
                    // cc.log('[SqliteBase.ts]: tr:', MySqlite.getInstance().transactions.get(trId));
                    MySqlite.getInstance().transactions.delete(trId);
                } else {
                    let id_ = MySqlite.getInstance().trId;
                    MySqlite.getInstance().transactions.set(id_, {
                        id: id_
                    });
                    result.trId = id_;
                }
            } else {
                // cc.log('sql链接断开,重连ing...');
                cc.log('[SqliteBase.ts]: 数据库已关闭,重新打开,opening...');
                // sql链接断开，重连
                await MySqlite.getInstance().openDB().then(async res => {
                    cc.log('[SqliteBase.ts]: 数据库重新打开成功', res);
                    await MySqlite.getInstance().transaction(operation).then(res => {
                        cc.log(`${tips[operation][1]};`, JSON.stringify(res));
                        result.code = $ErrorCode.SUCCESS;
                        // cc.log('74',result);
                    }).catch(err => {
                        cc.error(`${tips[operation][0]};`, JSON.stringify(err));
                    });

                    if (operation != sql.TransactionOperation.BEGIN) {
                        await _this.closeDB();
                        MySqlite.getInstance().transactions.delete(trId);
                    } else {
                        let id_ = MySqlite.getInstance().trId;
                        MySqlite.getInstance().transactions.set(id_, {
                            id: id_
                        });
                        result.trId = id_;
                    }
                }).catch(err => {
                    cc.error('[SqliteBase.ts]: 数据库重新打开失败', err);
                });
            }
        } catch (e) {
            cc.error('[SqliteBase.ts]: error:', e);
        } finally {
            cc.log('[SqliteBase.ts]: result:', JSON.stringify(result));
            return result;
        }

    }

    async closeDB() {
        try {
            let isOpen = await MySqlite.getInstance().isOpen();
            if (isOpen) {
                await MySqlite.getInstance().closeDB().then(() => {
                    cc.log('[SqliteBase.ts]: close db success');
                }).catch(err => {
                    throw err;
                });
            } else {
                cc.warn('[SqliteBase.ts]: db is closed');
            }

        } catch (err) {
            cc.error('[SqliteBase.ts]: close db error:', err);
        }
    }
}

// 直接export default DBInterfaceClass;//err 这种方式是会报错的，因为不能直接导出变量，需要用一个接口来继承变量然后导出，比如 const dbInterface = class DBInterfaceClass{}; dbInterface 就是接口
// export default dbInterface;
