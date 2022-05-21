/* 
    wizard 业务管理层
 */
import WizardDBI from '../dbi/dbi.Wizard';
import $ErrorCode from '../../utils/errorcode';
import * as $moment from "moment";
import $Conf from "../../config/cfg_index";
const dbi = new WizardDBI();

export default class WizardClass {
    constructor() { }

    /**
    * 获取数据库版本
    * @returns 
    */
    async getDBVersion() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            version: ""
        };
        try {
            result = await dbi.getDBVersion();
        } catch (err) {
            console.error('wizard bll getDBVersion error:', err);
        } finally {
            return result;
        }
    }


    /**
     * 设置数据库版本
     * @returns 
     */
    async setDBVersion({ version }: { version: string }) {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED
        };
        try {
            result = await dbi.setDBVersion({ version });
        } catch (err) {
            console.error('wizard bll setDBVersion error:', err);
        } finally {
            return result;
        }
    }

    /**
     * 初始化数据库信息
     * @returns 
     */
    async initDB() {
        const _this = this;
        let result: { code: number, msg?: string, version?: string } = {
            code: $ErrorCode.DB_FAILED,
            version: ""
        };
        try {
            result = await dbi.initDB();
        } catch (err) {
            console.error('wizard bll initDB error:', err);
        } finally {
            return result;
        }
    }

    /**
     * 升级数据库
     * @returns 
    */
    async upgradeDB(oldversion: string, newversion: string) {
        const _this = this;
        let result: { code: number, msg?: string, version?: string } = {
            code: $ErrorCode.DB_FAILED,
            version: ""
        };
        try {
            if (!oldversion || !newversion || newversion <= oldversion  || $Conf.sqlite.versions.length == 0) {
                result.code = $ErrorCode.PARAMS_FAILED;
                return;
            }

            let versions = $Conf.sqlite.versions;
            let currversion = oldversion;
            for (let i = 0; i < versions.length; i++) {
                let upgradeInfo = versions[i];
                if(currversion == upgradeInfo.prev){
                    let rv = await dbi.upgradeDB(upgradeInfo.prev, upgradeInfo.version);
                    if(rv.code == $ErrorCode.SUCCESS){
                        result.code = rv.code;
                        result.version = rv.version;
                        currversion = rv.version;
                    }else{
                        result.code = rv.code;
                        result.version = rv.version;
                        break;
                    }
                }
            }

        } catch (err) {
            console.error('wizard bll upgradeDB error:', err);
        } finally {
            return result;
        }
    }
}