/* 
    task 业务管理层
 */
import TaskDBI from '../dbi/dbi.Task';
import $ErrorCode from '../../utils/errorcode';
import ProjectDBI from '../dbi/dbi.Project';
import * as $moment from "moment";
const dbi = new TaskDBI();
const proDBI = new ProjectDBI();

export default class TaskClass {
    constructor() { }
    // 建表
    async createTable() {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            // rows: []
        };
        try {
            result = await dbi.createTable();
        } catch (e) {
            console.error('task bll createTable error:', e);
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
            result = await dbi.fetch();
        } catch (e) {
            console.error('task bll fetch error:', e);
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
            result = await dbi.temp_add(values);
        } catch (e) {
            console.error('task bll temp_add error:', e);
        } finally {
            return result;
        }
    }
    /**
     * 分页查询记录
     * @param {number} [currpage=0] 当前页 
     * @param {number} [pagesize=0] 页面尺寸
     * @param {number} [id] 任务索引（搜索用）
     * @param {number} [proId] 项目索引（搜索用）// 当传了proId,把项目数据也一起传过去 // 【废弃】id和proId都传时，只有proId生效
     * */
    async get(params) {
        const _this = this;
        let result: { code: number, rows, total: number, project?, msg?: string } = {
            code: $ErrorCode.DB_FAILED,
            rows: [],
            project: {},
            total: 0,
        };
        try {
            let offset = 0;
            let limit = 0;
            if (params.currpage && params.pagesize) {
                limit = params.pagesize;
                offset = (params.currpage - 1) * params.pagesize;
            }
            let columns = ['*'];
            let searchs = {};
            let whereRow = '';
            let sorts = [{
                'id': 1
            }];
            if (params.proId != undefined) {
                whereRow += `WHERE proId = ${params.proId}`;
                if (params.id != undefined) {
                    whereRow += ` AND id = ${params.id}`;
                }
                let rv1 = await dbi.get({
                    offset,
                    limit,
                    columns,
                    searchs,
                    sorts,
                    whereRow,
                });
                if (rv1.code == $ErrorCode.SUCCESS) {
                    result.rows = rv1.rows;
                    result.total = rv1.total;
                    // 把项目信息一起带过去
                    columns = ['*'];
                    searchs = {};
                    sorts = [{
                        'id': 1
                    }];
                    whereRow = '';
                    whereRow += `WHERE id = ${params.proId}`;
                    let rv2 = await proDBI.get({
                        columns,
                        searchs,
                        sorts,
                        whereRow,
                    });
                    if (rv2.code == $ErrorCode.SUCCESS && rv2.rows.length == 1) {
                        result.project = rv2.rows[0];
                        result.code = rv2.code;
                    } else {
                        // result.rows = [];
                        // result.total = 0;
                        result.code = rv2.code;
                        result.msg = 'task bll get error:fetch project error';
                        return result;
                    }
                } else {
                    result.code = rv1.code;
                    return result;
                }
            } else {
                whereRow = '';
                if (params.id != undefined) {
                    whereRow = `WHERE id = ${params.id}`;
                }
                result = await dbi.get({
                    offset,
                    limit,
                    columns,
                    searchs,
                    sorts,
                    whereRow,
                });
            }
        } catch (e) {
            console.error('task bll get error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 添加任务
     * @param {number} proId 项目索引，给哪个项目添加任务
     * @param {number} category 任务类型 0 新增需求 1 项目优化 2 修复bug
     * @param {number} parentId上级任务索引，0为顶级任务
     * @param {string} name 任务名称
     * @param {string} describe 任务描述
     * @param {float} estimateTime 任务预计耗时
     * @param {number} estUnit 任务预计耗时单位 0小时 1天 2月
     * */
    async add(params: { proId: number, category?, name?, describe?, estimateTime?, estUnit?, parentId?} = { proId: - 1 }) {
        const _this = this;
        let result: { code: number, msg?: string } = {
            code: $ErrorCode.ADD_FAILED,
            msg: "",
        };
        try {
            let row: { category?, name?, describe?, estimateTime?, estUnit?, proId?, parentId?, rootId?, createTime?, status?} = {}; // 要传给dbi添加的数据
            row.category = params.category;
            row.name = params.name;
            row.describe = params.describe;
            row.estimateTime = params.estimateTime;
            row.estUnit = params.estUnit;

            // 1.查询项目索引是否存在
            let columns = ['id', 'name'];
            let searchs = {};
            let whereRow = '';
            whereRow += `WHERE id = ${params.proId}`;
            let sorts = [{
                'id': 1
            }];
            let rv1 = await proDBI.get({
                columns,
                searchs,
                sorts,
                whereRow,
            });
            if (rv1.code == $ErrorCode.SUCCESS && rv1.rows.length == 1) {
                row.proId = params.proId;
            } else {
                result.code = $ErrorCode.OBJECT_NOEXISTS;
                result.msg = `pro id = ${params.proId} is not exist`;
                return;
            }

            // 2. 查询上级任务索引是否存在
            if (params.parentId != 0) {
                columns = ['id', 'name', 'parentId', 'rootId'];
                searchs = {};
                whereRow = '';
                whereRow += `WHERE id = ${params.parentId}`;
                sorts = [{
                    'id': 1
                }];
                rv1 = await dbi.get({
                    columns,
                    searchs,
                    sorts,
                    whereRow,
                });
                if (rv1.code == $ErrorCode.SUCCESS && rv1.rows.length == 1) {
                    let supTask = rv1.rows[0];
                    if (supTask.parentId == 0 && supTask.rootId == 0) {
                        row.parentId = params.parentId;
                        row.rootId = params.parentId;
                    } else {
                        row.parentId = params.parentId;
                        row.rootId = supTask.rootId;
                    }
                } else {
                    result.code = $ErrorCode.OBJECT_NOEXISTS;
                    result.msg = `supTask id = ${params.parentId} is not exist`;
                    return;
                }
            } else {
                row.parentId = 0;
                row.rootId = 0;
            }

            // 3. 查询任务名称是否重复
            columns = ['id', 'name'];
            searchs = {};
            whereRow = '';
            whereRow += `WHERE name = '${params.name}'`;
            whereRow += ` AND proId = ${params.proId}`;
            sorts = [{
                'id': 1
            }];
            let rv2 = await dbi.get({
                columns,
                searchs,
                sorts,
                whereRow,
            });
            if (rv2.code == $ErrorCode.SUCCESS) {
                if (rv2.rows.length == 0) {

                } else {
                    result.code = $ErrorCode.OBJECT_EXISTS;
                    result.msg = `task name is duplicate `;
                    return;
                }
            } else {
                result.code = $ErrorCode.DB_FAILED;
                result.msg = `task fetch error`;
                return;
            }

            let nowspan = $moment().unix();
            row.createTime = nowspan;
            row.status = 0;

            result = await dbi.add(row);
        } catch (e) {
            console.error('task bll add error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 编辑任务
     * 	状态切换
     * 	   	并赋值
     * 	   	未赋值
     * 	状态未切换
     * 		赋值
     * 		未赋值
     * @param {object} params
     * @param {number} params.id 任务索引
     * @param {number} [params.category=null] 任务类型
     * @param {number} [params.parentId=null] 上级任务索引
     * @param {number} [params.rootId=null] 根任务索引
     * @param {string} [params.name=null] 任务名称
     * @param {number} params.status 任务状态 0: 未开始(可以编辑任务创建时间) 1: 正在进行(可以编辑任务创建时间、开始时间) 2:已完成(可以编辑任务创建时间、开始时间、完成时间)
     * @param {string} [params.describe=null] 任务描述
     * @param {float} [params.estimateTime=null] 任务预计耗时 .2
     * @param {number} [params.estUnit=null] 任务预计耗时单位  0小时 1天 2月'
     * @param {number} [params.createTime=null] 任务创建时间 unix 
     * @param {number} [params.startTime=null] 任务开始时间 unix
     * @param {number} [params.completeTime=null] 任务完成时间 unix
     * */
    async set({
        id,
        category = null,
        parentId = null,
        rootId = null,
        name = null,
        status,
        describe = null,
        estimateTime = null,
        estUnit = null,
        createTime = null,
        startTime = null,
        completeTime = null
    }: { id?, status?, name?, category?, parentId?, rootId?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?}) {
        const _this = this;
        let result: { code: number, msg?: string } = {
            code: $ErrorCode.SET_FAILED,
            msg: "",
        };
        try {
            let columns = ['*'];
            let searchs = {};
            let whereRow = '';
            whereRow += `WHERE id = ${id}`;
            let sorts = [{
                'id': 1
            }];
            let rv = await dbi.get({
                columns,
                searchs,
                sorts,
                whereRow,
            });
            if (rv.code == $ErrorCode.SUCCESS && rv.rows.length == 1) {
                let prevTask = rv.rows[0];
                // let now = Date.now();
                let now = $moment().unix();
                let row: { id, status?, name?, category?, parentId?, rootId?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?, realityTime?} = { id };
                // row.id = id;
                row.status = status;
                if (name != null) {
                    row.name = name;
                }
                if (category != null) {
                    row.category = category;
                }
                if (parentId != null) {
                    row.parentId = parentId;
                }
                if (rootId != null) {
                    row.rootId = rootId;
                }
                if (describe != null) {
                    row.describe = describe;
                }
                if (estimateTime != null) {
                    row.estimateTime = estimateTime;
                }
                if (estUnit != null) {
                    row.estUnit = estUnit;
                }

                if (createTime != null) {
                    row.createTime = createTime;
                }

                if (prevTask.status == 0 && row.status == 1) {
                    // 由未开始切到正在进行
                    if (startTime != null) {
                        row.startTime = startTime;
                    } else {
                        row.startTime = now;
                    }

                } else if (prevTask.status == 1 && row.status == 0) {
                    // 由正在进行切到未开始 （理论上不允许）
                    row.startTime = 0;
                } else if (prevTask.status == 2 && row.status == 1) {
                    // 由已完成切到正在进行（理论上不允许）
                    if (startTime != null) {
                        row.startTime = startTime;
                    } else {
                        row.startTime = now;
                    }
                    row.completeTime = 0;
                    row.realityTime = 0;
                } else if (prevTask.status == 1 && row.status == 2) {
                    // 由正在进行切到已完成
                    if (startTime != null && completeTime == null) {
                        row.startTime = startTime;
                        row.completeTime = now;
                        row.realityTime = row.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime != null && completeTime != null) {
                        row.startTime = startTime;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime == null && completeTime != null) {
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - prevTask.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else {
                        row.completeTime = now;
                        row.realityTime = row.completeTime - prevTask.startTime; // 实际耗时 = 完成时间 - 开始时间
                    }

                } else if (prevTask.status == 2 && row.status == 0) {
                    // 由已完成 切到 未开始（理论上不允许）
                    row.startTime = 0;
                    row.completeTime = 0;
                    row.realityTime = 0;
                } else if (prevTask.status == 0 && row.status == 2) {
                    // 由未开始 切到 已完成
                    if (startTime != null && completeTime == null) {
                        row.startTime = startTime;
                        row.completeTime = now;
                        row.realityTime = row.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime != null && completeTime != null) {
                        row.startTime = startTime;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime == null && completeTime != null) {
                        row.startTime = now;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else {
                        row.startTime = now;
                        row.completeTime = now;
                        row.realityTime = 0;
                    }
                } else if (prevTask.status == 0 && row.status == 0) {

                } else if (prevTask.status == 1 && row.status == 1) {
                    if (startTime != null) {
                        row.startTime = startTime;
                    }
                } else if (prevTask.status == 2 && row.status == 2) {
                    if (startTime != null && completeTime == null) {
                        row.startTime = startTime;
                        row.realityTime = prevTask.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime != null && completeTime != null) {
                        row.startTime = startTime;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime == null && completeTime != null) {
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - prevTask.startTime; // 实际耗时 = 完成时间 - 开始时间
                    } else { }
                }
                result = await dbi.set(row);
            } else {
                result.code = $ErrorCode.OBJECT_NOEXISTS;
                result.msg = `task id = ${id} is not exist`;
                return
            }

            // console.log(JSON.stringify(rv));
        } catch (e) {
            console.error('task bll set error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 删除任务
     * @param {object} params   
     * @param {array} [params.ids = []] 要删除的任务索引
     * */
    async remove({ ids = [] } = { ids: [] }) {
        const _this = this;
        let result: { code: number, msg?: string } = {
            code: $ErrorCode.ADD_FAILED,
            msg: "",
        };
        try {
            if (ids.length == 0) {
                result.code = $ErrorCode.PARAMS_FAILED;
                return;
            }
            result = await dbi.remove({ ids });
        } catch (e) {
            console.error('task bll remove error:', e);
        } finally {
            return result;
        }
    }

}