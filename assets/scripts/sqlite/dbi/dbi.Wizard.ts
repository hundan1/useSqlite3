/* 
    wizard 数据接口层
 */
import DBI from '../../utils/SqliteBase';
import $ErrorCode from '../../utils/errorcode';
import $formatSql from '../../utils/formatSql';
import $Conf from "../../config/cfg_index";
import ConfigDBI from '../dbi/dbi.Config';
import * as $moment from "moment";

const configDBI = new ConfigDBI();
// Sqlite 没法像 MySQL 那样增加 comment 注释，但可以通过 -- 的方式增加 DDL 注释
export default class WizardDBIClass extends DBI {
    constructor() {
        super(); //调用此方法,this才用可以用,代表父类的构造函数，返回的却是子类
    }
    readonly SQL_LIST: { [version: string]: string } = {
        [$Conf.sqlite.baseversion]: `
        DROP TABLE IF EXISTS 'config';
        CREATE TABLE IF NOT EXISTS 'config'(
            'id' INTEGER PRIMARY KEY NOT NULL,
            'name' VARCHAR UNIQUE NOT NULL, -- 参数名称
            'value' VARCHAR DEFAULT 0, -- 参数值
            'describe' VARCHAR, -- 描述
            'modifytime' VARCHAR -- 操作时间
        );
        
        DROP TABLE IF EXISTS 'projects';
        CREATE TABLE IF NOT EXISTS 'projects'(
            'id' INTEGER PRIMARY KEY NOT NULL,
            'old_id' VARCHAR, -- 之前使用的id
            'name' VARCHAR NOT NULL, -- 名称
            'status' INT DEFAULT 0, -- 当前状态 0未开始 1正在进行 2已完成
            'describe' VARCHAR, -- 描述
            'createTime' BIGINT, -- 创建日期 单位s
            'startTime' BIGINT, -- 开始日期 单位s
            'completeTime' BIGINT,-- 完成日期 单位s
            'estimateTime' REAL DEFAULT 0, -- 预计耗时
            'estUnit' INT COMMENT DEFAULT 0, -- 预计耗时时间单位 0小时 1天 2月
            'realityTime' BIGINT DEFAULT 0, -- 新改的 实际耗时 排序用 单位s
            'realityTimeTxt' VARCHAR, -- 之前使用的实际耗时
            'modifytime' VARCHAR -- 操作时间
        );

        DROP TABLE IF EXISTS 'tasks';
        CREATE TABLE IF NOT EXISTS 'tasks'(
            'id' INTEGER PRIMARY KEY NOT NULL,
            'old_id' VARCHAR, -- 之前使用的id
            'name' VARCHAR NOT NULL, -- 名称
            'describe' VARCHAR, -- 描述
            'status' INT DEFAULT 0, -- 当前状态 0未开始 1正在进行 2已完成
            'category' INT, -- 类型：0 新增需求 1 项目优化 2 修复bug
            'proId' INT NOT NULL, -- 对应的项目id
            'old_proId' VARCHAR, -- 之前使用的对应的项目id
            'parentId' INT DEFAULT 0, -- 上级任务id 0为顶级任务
            'old_parentId' VARCHAR, -- 之前使用的上级任务id
            'rootId' INT DEFAULT 0, -- 根任务id 0为顶级任务
            'createTime' BIGINT, -- 创建日期 单位s
            'startTime' BIGINT, -- 开始日期 单位s
            'completeTime' BIGINT, -- 完成日期 单位s
            'estimateTime' REAL DEFAULT 0, -- 预计耗时
            'estUnit' INT DEFAULT 0, -- 预计耗时时间单位 0小时 1天 2月
            'realityTime' BIGINT DEFAULT 0, -- 新改的 实际耗时 排序用 单位s
            'realityTimeTxt' VARCHAR, -- 之前使用的实际耗时
            'modifytime' VARCHAR COMMENT -- 操作时间
        );
    `,
        "v20220516002": `
        DROP TABLE IF EXISTS 'tests';
        CREATE TABLE IF NOT EXISTS 'tests'(
            'id' INTEGER PRIMARY KEY NOT NULL,
            'str' VARCHAR NOT NULL, -- 文本测试
            'number' INT DEFAULT 0, -- 数字测试
            'modifytime' VARCHAR -- 操作时间
        );`,
        "v20220516003": `
        DROP TABLE IF EXISTS 'tests';
        `,
    };
    /**
     * 获取数据库版本信息
     * @param param0 
     * @returns 
     */
    async getDBVersion() {

        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            version: ""
        };
        try {
            let rv = await configDBI.get({
                columns: ["name", "value"],
                whereRow: `where name = "Version"`
            });
            if (rv.code == $ErrorCode.SUCCESS && rv.total == 1) {
                result.code = $ErrorCode.SUCCESS;
                result.version = rv.rows[0].value;
            }

        } catch (err) {
            cc.error('Wizard dbi getDBVersion error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

    /**
     * 设置数据库版本信息
     * @param {string} version  
     * @returns 
     */
    async setDBVersion({ version = "" }: { version: string }) {

        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED
        };
        try {
            let rv = await configDBI.set({ name: "Version", value: version });
            if (rv.code == $ErrorCode.SUCCESS) {
                result.code = rv.code;
            }

        } catch (err) {
            cc.error('Wizard dbi setDBVersion error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

    /**
     * 初始化数据库
     * @param 
     * @returns 
     */
    async initDB() {

        const _this = this;
        let result: { code: number, version?: string, msg?: string } = {
            code: $ErrorCode.DB_FAILED
        };
        let trId = 0;
        try {
            let baseversion = $Conf.sqlite.baseversion;
            let sqlStr = this.SQL_LIST[baseversion];
            if (!sqlStr) {
                result.code = $ErrorCode.PARAMS_FAILED;
                result.msg = `can not find ${baseversion} sqlStr`;
                return;
            }
            let rv = null;
            rv = await _this.transaction(sql.TransactionOperation.BEGIN); //开启事务
            if (rv.code == $ErrorCode.SUCCESS) {
                trId = rv.trId;
            } else {
                return;
            }
            // 1.初始化数据库
            rv = await _this.execute(sqlStr, trId);
            // cc.log('initdb sqlStr:', sqlStr);
            if (rv.code != $ErrorCode.SUCCESS) {
                let rv_error = new Error('init db failed');
                throw rv_error;
            }

            // 2.保存版本信息
            result = await configDBI.set({ name: "Version", value: baseversion, describe: "数据库当前版本号" }, trId);
            if (result.code != $ErrorCode.SUCCESS) {
                let rv_error = new Error('set config error');
                throw rv_error;
            }
            result.version = baseversion;
            await _this.transaction(sql.TransactionOperation.COMMIT, trId); //提交事务
        } catch (err) {
            await _this.transaction(sql.TransactionOperation.ROLLBACK, trId); //回滚事务

            cc.error('wizard dbi setDBVersion error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

    /**
     * 升级数据库
     * @param 
     * @returns 
     */
    async upgradeDB(oldversion: string, newversion: string) {

        const _this = this;
        let result: { code: number, version?: string, msg?: string } = {
            code: $ErrorCode.DB_FAILED
        };
        let trId = 0;
        try {
            if (!oldversion || !newversion || newversion <= oldversion) {
                result.code = $ErrorCode.PARAMS_FAILED;
                return;
            }


            let sqlStr = this.SQL_LIST[newversion];
            if (!sqlStr) {
                result.msg = `can not find ${newversion} sqlStr`;
                result.code = $ErrorCode.PARAMS_FAILED;
                return;
            }
            let rv = null;
            rv = await _this.transaction(sql.TransactionOperation.BEGIN); //开启事务
            if (rv.code == $ErrorCode.SUCCESS) {
                trId = rv.trId;
            } else {
                return;
            }


            // 1.执行该版本sql
            rv = await _this.execute(sqlStr, trId);
            // cc.log('initdb sqlStr:', sqlStr);
            if (rv.code != $ErrorCode.SUCCESS) {
                let rv_error = new Error(`execute ${newversion} sqlStr failed`);
                result.msg = rv.msg;

                throw rv_error;
            }

            // 2.保存版本信息
            result = await configDBI.set({ name: "Version", value: newversion }, trId);
            if (result.code != $ErrorCode.SUCCESS) {
                let rv_error = new Error('set config error');
                throw rv_error;
            }
            result.version = newversion;

            await _this.transaction(sql.TransactionOperation.COMMIT, trId); //提交事务
        } catch (err) {
            await _this.transaction(sql.TransactionOperation.ROLLBACK, trId); //回滚事务

            cc.error('wizard dbi setDBVersion error:', JSON.stringify(err));
        } finally {
            return result;
        }
    }

}
