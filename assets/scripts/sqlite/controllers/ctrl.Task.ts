/**
 * Task 控制器
 */
//  const TaskController = {};
// const ProjectBll = require('../class/bll/task');
// const $ErrorCode = require('../class/utility/error');
import TaskBll from '../bll/bll.Task';
import $ErrorCode from '../../utils/errorcode';
import $Validator from 'validator';
const bll = new TaskBll();

const TaskController = {
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
            console.error('task contr createTable error:', e);
        } finally {
            return result;
        }
    },

    /**
     * 查询任务（支持分页、条件查询）
     * @param {number} [currpage=0] 当前页  
     * @param {number} [pagesize=0] 页面尺寸 只有当 currpage、pagesize都传值得时候才会分页查询，否则全部查询
     * @param {number} [id] 任务索引
     * @param {number} [proId] 项目索引，查询对应项目下的任务 //（id和proId都传入时，只有proId生效）
     * */
    get: async function (req: { currpage?, pagesize?, id?, proId?} = {}) {
        let currpage = req.currpage || '';
        let pagesize = req.pagesize || '';
        let id = req.id || '';
        let proId = req.proId || '';
        const _this = this;
        let result: { code: number, rows, total: number, project?, msg?: string } = {
            code: $ErrorCode.PARAMS_FAILED,
            msg: "",
            rows: [],
            total: 0
        };
        try {
            let params: { currpage?, pagesize?, id?, proId?} = {};
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
                if (!$Validator.isInt(id.toString())) {
                    result.msg = 'params id is incorrect';
                    return result;
                } else {
                    params.id = id;
                }
            }
            if (!$Validator.isEmpty(proId.toString())) {
                if (typeof proId != "number" || !$Validator.isInt(proId.toString())) {
                    result.msg = 'params proId is incorrect';
                    return result;
                } else {
                    params.proId = proId;
                    // delete params.id;
                }
            }
            params.currpage = currpage || 0;
            params.pagesize = pagesize || 0;

            result = await bll.get(params);
        } catch (e) {
            console.error('task contr get error:', e);
        } finally {
            return result;
        }
    },

    /**
     * 添加任务
     * @param {number} proId 项目索引，给哪个项目添加任务
     * @param {number} [category=0] 任务类型 0 新增需求 1 项目优化 2 修复bug
     * @param {number} [parentId=0] 上级任务索引，0为顶级任务
     * @param {string} name 任务名称
     * @param {string} [describe=''] 任务描述
     * @param {float} [estimateTime=0] 任务预计耗时
     * @param {number} [estUnit=0] 任务预计耗时单位 0小时 1天 2月
     * */
    add: async function (req: { proId?, category?, parentId?, name?, describe?, estimateTime?, estUnit?} = {}) {
        const _this = this;
        // console.log('添加参数:',JSON.stringify(req));
        let proId = req.proId;
        let category = req.category || 0;
        let parentId = req.parentId || 0;
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
            if (proId == undefined || typeof proId != "number" || !$Validator.isInt(proId.toString())) {
                result.msg = 'params proId is incorrect';
                return result;
            }
            if (typeof category != "number" || !$Validator.isInt(category.toString())) {
                result.msg = 'params category is incorrect';
                return result;
            }
            if (typeof parentId != "number" || !$Validator.isInt(parentId.toString())) {
                result.msg = 'params parentId is incorrect';
                return result;
            }
            if (name == undefined || typeof name != "string" || $Validator.isEmpty(name.toString(), { ignore_whitespace: true }) || !$Validator.isLength(name.toString(), { min: 1, max: 64 })) {
                result.msg = 'params name is incorrect';
                return result;
            }
            // typeof undefined "undefined"
            if (describe != '' && (typeof describe != "string" || !$Validator.isLength(describe.toString(), { min: 1, max: 128 }))) {
                result.msg = 'params describe is incorrect';
                return result;
            }
            if (typeof estUnit != "number" || !$Validator.isInt(estUnit.toString())) {
                result.msg = 'params estUnit is incorrect';
                return result;
            }

            result = await bll.add({
                proId,
                category,
                parentId,
                name,
                describe,
                estimateTime,
                estUnit,
            });
        } catch (e) {
            console.error('task contr add error:', e);
        } finally {
            return result;
        }
    },

    /**
     * 编辑任务
     * @param {object} req
     * @param {number} req.id 任务索引
     * @param {number} [req.category] 任务类型
     * @param {number} [req.parentId] 上级任务索引
     * @param {number} [req.rootId] 根任务索引
     * @param {string} [req.name] 任务名称
     * @param {number} req.status 任务状态 0: 未开始(可以编辑任务创建时间) 1: 正在进行(可以编辑任务创建时间、开始时间) 2:已完成(可以编辑任务创建时间、开始时间、完成时间)
     * @param {string} [req.describe] 任务描述
     * @param {float} [req.estimateTime] 任务预计耗时 .2
     * @param {number} [req.estUnit] 任务预计耗时单位  0小时 1天 2月'
     * @param {number} [req.createTime] 任务创建时间 unix 
     * @param {number} [req.startTime] 任务开始时间 unix
     * @param {number} [req.completeTime] 任务完成时间 unix
     */
    set: async function (req: { id?, status?, name?, category?, parentId?, rootId?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?} = {}) {
        const _this = this;
        let id = req.id;
        let name = req.name || '';
        let status = req.status;
        let category = req.category;
        let parentId = req.parentId;
        let rootId = req.rootId;
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
            let params: { id?, status?, name?, category?, parentId?, rootId?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?} = {};
            // 参数校验
            if (id == undefined || typeof id != 'number' || !$Validator.isInt(id.toString())) {
                result.msg = 'params id is incorrect';
                return result;
            } else {
                params.id = id;
            }

            if (category != undefined) {
                if (typeof category != 'number' || !$Validator.isInt(category.toString())) {
                    result.msg = 'params category is incorrect';
                    return result;
                } else {
                    params.category = category;
                }
            }

            if (parentId != undefined) {
                if (typeof parentId != 'number' || !$Validator.isInt(parentId.toString())) {
                    result.msg = 'params parentId is incorrect';
                    return result;
                } else {
                    params.parentId = parentId;
                }
            }

            if (rootId != undefined) {
                if (typeof rootId != 'number' || !$Validator.isInt(rootId.toString())) {
                    result.msg = 'params rootId is incorrect';
                    return result;
                } else {
                    params.rootId = rootId;
                }
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
                if (typeof estimateTime != 'number' || !$Validator.isFloat(estimateTime.toString())) {
                    result.msg = 'params estimateTime is incorrect';
                    return result;
                } else {
                    params.estimateTime = estimateTime;
                }
            }

            if (estUnit != undefined) {
                if (typeof estUnit != 'number' || !$Validator.isInt(estUnit.toString())) {
                    result.msg = 'params estUnit is incorrect';
                    return result;
                } else {
                    params.estUnit = estUnit;
                }
            }

            if (!$Validator.isEmpty(createTime.toString(), { ignore_whitespace: true })) {
                if (typeof createTime != 'number' || !$Validator.isInt(createTime.toString())) {
                    result.msg = 'params createTime is incorrect';
                    return result;
                } else {
                    params.createTime = createTime;
                }
            }

            if (!$Validator.isEmpty(startTime.toString(), { ignore_whitespace: true })) {
                if (typeof startTime != 'number' || !$Validator.isInt(startTime.toString())) {
                    result.msg = 'params startTime is incorrect';
                    return result;
                } else {
                    params.startTime = startTime;
                }
            }

            if (!$Validator.isEmpty(completeTime.toString(), { ignore_whitespace: true })) {
                if (typeof completeTime != 'number' || !$Validator.isInt(completeTime.toString())) {
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
            console.error('task contr set error:', e);
        } finally {
            return result;
        }
    },

    /**
     * 删除任务（以及任务下的子任务）
     * @param {string} ids 要删除的项目索引，支持批量删，多个已逗号分隔  
     * */
    remove: async function (req: { ids?} = {}) {
        const _this = this;
        let ids = req.ids || '';
        let result: { code: number, msg?: string } = {
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
            console.error('task contr remove error:', e);
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
            console.error('task contr fetch error:', e);
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
            console.error('task contr temp_add error:', e);
        } finally {
            return result;
        }
    },
};
export default TaskController;