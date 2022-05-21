/**
 * Project 控制器
 */

// const ProjectBll = require('../class/bll/project');
// const $ErrorCode = require('../class/utility/error');
import ProjectBll from '../bll/bll.Project';
import $ErrorCode from '../../utils/errorcode';
import $Validator from 'validator';
const bll = new ProjectBll();

const ProjectController = {
    // 建表
    createTable: async function () {
        const _this = this;
        let result = {
            code: $ErrorCode.PARAMS_FAILED,
            // rows: []
        };
        try {
            result = await bll.createTable();
        } catch (e) {
            console.error('project contr createTable error:', e);
        } finally {
            return result;
        }
    },

    // 查询记录
    fetch: async function () {
        const _this = this;
        let result = {
            code: $ErrorCode.PARAMS_FAILED,
            rows: []
        };
        try {
            result = await bll.fetch();
        } catch (e) {
            console.error('project contr fetch error:', e);
        } finally {
            return result;
        }
    },

    // 插入记录temp_add 批量数据导入 任务临时用
    temp_add: async function (values) {
        const _this = this;
        let result = {
            code: $ErrorCode.PARAMS_FAILED,
            // rows: []
        };
        try {
            result = await bll.temp_add(values);
        } catch (e) {
            console.error('project contr temp_add error:', e);
        } finally {
            return result;
        }
    },

    // 查询项目
    get: async function (req: { currpage?, pagesize?, id?} = {}) {
        let currpage = req.currpage || '';
        let pagesize = req.pagesize || '';
        let id = req.id || '';
        const _this = this;
        let result: { code: number, rows, msg?: string, total?: number } = {
            code: $ErrorCode.PARAMS_FAILED,
            msg: "",
            rows: [],
            total: 0
        };
        try {
            let params: { id?, currpage?, pagesize?} = {};
            // 参数校验
            if (currpage && !$Validator.isInt(currpage.toString(), { gte: 1 })) {
                result.msg = 'params currpage is incorrect';
                return result;
            }
            if (pagesize && !$Validator.isInt(pagesize.toString(), { gte: 1 })) {
                result.msg = 'params pagesize is incorrect';
                return result;
            }
            if (!$Validator.isEmpty(id.toString())) {
                if (typeof id != "number" || !$Validator.isInt(id.toString())) {
                    result.msg = 'params id is incorrect';
                    return result;
                } else {
                    params.id = id;
                }
            }
            params.currpage = currpage || 0;
            params.pagesize = pagesize || 0;

            result = await bll.get(params);
        } catch (e) {
            console.error('project contr get error:', e);
        } finally {
            return result;
        }
    },

    // 添加项目
    add: async function (req: { name?, describe?, estimateTime?, estUnit?} = {}) {
        const _this = this;
        let name = req.name;
        let describe = req.describe || '';
        let estimateTime = req.estimateTime || 0;
        let estUnit = req.estUnit || 0;
        let result: { code: number, msg?: string } = {
            code: $ErrorCode.PARAMS_FAILED,
            msg: "",
        };
        try {
            let params = {};
            // 参数校验
            if (name == undefined || typeof name != "string" || $Validator.isEmpty(name.toString(), { ignore_whitespace: true }) || !$Validator.isLength(name.toString(), { min: 1, max: 64 })) {
                result.msg = 'params name is incorrect';
                return result;
            }
            // typeof undefined "undefined"
            if (describe != '' && (typeof describe != "string" || !$Validator.isLength(describe.toString(), { min: 1, max: 128 }))) {
                result.msg = 'params describe is incorrect';
                return result;
            }
            result = await bll.add({
                name,
                describe,
                estimateTime,
                estUnit,
            });
        } catch (e) {
            console.error('project contr add error:', e);
        } finally {
            return result;
        }
    },

    /**
     * 编辑项目
     * @param {object} req
     * @param {number} req.id 项目索引
     * @param {string} [req.name] 项目名称
     * @param {number} req.status 项目状态 0: 未开始(可以编辑项目创建时间) 1: 正在进行(可以编辑项目创建时间、开始时间) 2:已完成(可以编辑项目创建时间、开始时间、完成时间)
     * @param {string} [req.describe] 项目描述
     * @param {float} [req.estimateTime] 项目预计耗时 .2
     * @param {number} [req.estUnit] 项目预计耗时单位  0小时 1天 2月'
     * @param {number} [req.createTime] 项目创建时间 unix 
     * @param {number} [req.startTime] 项目开始时间 unix
     * @param {number} [req.completeTime] 项目完成时间 unix
     */
    set: async function (req: { id?, name?, status?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?} = {}) {
        const _this = this;
        let id = req.id;
        let name = req.name || '';
        let status = req.status;
        let describe = req.describe || '';
        let estimateTime = req.estimateTime || '';
        let estUnit = req.estUnit;
        let createTime = req.createTime || '';
        let startTime = req.startTime || '';
        let completeTime = req.completeTime || '';
        let result: { code: number, msg?: string } = {
            code: $ErrorCode.PARAMS_FAILED,
            msg: "",
        };
        try {
            let params: { id?, status?, name?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?, realityTime?} = {};
            // 参数校验
            if (id == undefined || !$Validator.isInt(id.toString())) {
                result.msg = 'params id is incorrect';
                return result;
            } else {
                params.id = id;
            }
            if (!$Validator.isEmpty(name.toString(), { ignore_whitespace: true })) {
                if (!$Validator.isLength(name.toString(), { min: 1, max: 64 })) {
                    result.msg = 'params name is incorrect';
                    return result;
                } else {
                    params.name = name;
                }
            }

            if (status == undefined || !$Validator.isInt(status.toString())) {
                result.msg = 'params status is incorrect';
                return result;
            } else {
                params.status = status;
            }

            // typeof undefined "undefined"
            if (!$Validator.isEmpty(describe.toString(), { ignore_whitespace: true })) {
                if (typeof describe != "string" || !$Validator.isLength(describe.toString(), { min: 1, max: 128 })) {
                    result.msg = 'params describe is incorrect';
                    return result;
                } else {
                    params.describe = describe;
                }
            }

            if (!$Validator.isEmpty(estimateTime.toString(), { ignore_whitespace: true })) {
                if (!$Validator.isFloat(estimateTime.toString())) {
                    result.msg = 'params estimateTime is incorrect';
                    return result;
                } else {
                    params.estimateTime = estimateTime;
                }
            }

            if (estUnit != undefined) {
                if (!$Validator.isInt(estUnit.toString())) {
                    result.msg = 'params estUnit is incorrect';
                    return result;
                } else {
                    params.estUnit = estUnit;
                }
            }

            if (!$Validator.isEmpty(createTime.toString(), { ignore_whitespace: true })) {
                if (!$Validator.isInt(createTime.toString())) {
                    result.msg = 'params createTime is incorrect';
                    return result;
                } else {
                    params.createTime = createTime;
                }
            }

            if (!$Validator.isEmpty(startTime.toString(), { ignore_whitespace: true })) {
                if (!$Validator.isInt(startTime.toString())) {
                    result.msg = 'params startTime is incorrect';
                    return result;
                } else {
                    params.startTime = startTime;
                }
            }

            if (!$Validator.isEmpty(completeTime.toString(), { ignore_whitespace: true })) {
                if (!$Validator.isInt(completeTime.toString())) {
                    result.msg = 'params completeTime is incorrect';
                    return result;
                } else {
                    params.completeTime = completeTime;
                }
            }

            if (!$Validator.isEmpty(startTime.toString(), { ignore_whitespace: true }) && !$Validator.isEmpty(completeTime.toString(), { ignore_whitespace: true })) {
                if (completeTime < startTime) {
                    result.msg = 'params completeTime、startTime are incorrect';
                    return result;
                }
            }

            result = await bll.set(params);
        } catch (e) {
            console.error('project contr set error:', e);
        } finally {
            return result;
        }
    },


    /**
     * 删除项目（以及项目下的任务）
     * @param {string} ids 要删除的项目索引，支持批量删，多个已逗号分隔  
     * */
    remove: async function (req: { ids: string } = { ids: "" }) {
        const _this = this;
        let ids = req.ids || '';
        let result = {
            code: $ErrorCode.PARAMS_FAILED,
            msg: "",
        };
        // console.log(ids);
        // return result;
        try {
            let params = {};
            // 参数校验
            if (ids == undefined || typeof ids != "string" || !ids.split(',').every(el => $Validator.isInt(el))) {
                result.msg = 'params ids is incorrect';
                return result;
            }
            // 判断索引是否重复、以及是否存在
            result = await bll.remove({
                ids: ids.split(','),
            });
        } catch (e) {
            console.error('project contr remove error:', e);
        } finally {
            return result;
        }
    },



};
export default ProjectController;
