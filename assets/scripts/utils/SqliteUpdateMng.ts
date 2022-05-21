/**
 * SqliteUpdateMng.ts 更新管理器
 */
import $ErrorCode from './errorcode';
import $formatSql from './formatSql';
import $Conf from "../config/cfg_index";
import DBI from './SqliteBase';
import WizardBLL from '../sqlite/bll/bll.Wizard';
const wizardBLL = new WizardBLL();

export default class SqliteUpdateMng {
    private static _instance: SqliteUpdateMng = null;
    public static getInstance() {
        if (SqliteUpdateMng._instance === null) {
            SqliteUpdateMng._instance = new SqliteUpdateMng();
        }
        return SqliteUpdateMng._instance;
    }
    public start() {
        this.autoUpdate();
    }

    public async autoUpdate() {

        let rv = await wizardBLL.getDBVersion();
        let version = rv.version;
        let lastversion = $Conf.sqlite.lastversion;
        if (version === "") {
            cc.log("init db start");
            let res = await wizardBLL.initDB();
            if (res.code !== $ErrorCode.SUCCESS) {
                cc.error("init db failed!");
                return;
            } else {
                cc.log("init db success!");
                version = res.version;
            }
        }

        cc.log(`curversion: ${version} lastversion: ${lastversion}`);
        if (lastversion > version) {
            cc.log("upgrade db start");
            let res = await wizardBLL.upgradeDB(version, lastversion);
            if (res.code !== $ErrorCode.SUCCESS) {
                cc.error("upgrade db failed!");
                return;
            } else {
                cc.log("upgrade db success!");
            }
        } else {
            // 已经是最新版了
        }

    }
}

// creator自动加载脚本，按官方引擎加载脚本规则（按名称）加载脚本,无需引入
if (CC_JSB && cc.sys.isNative) {
    SqliteUpdateMng.getInstance().start();
}