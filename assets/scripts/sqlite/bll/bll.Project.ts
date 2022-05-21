/* 
    project 业务管理层
 */
import ProjectDBI from '../dbi/dbi.Project';
import $ErrorCode from '../../utils/errorcode';
import * as $moment from "moment";
const dbi = new ProjectDBI();
export default class ProjectClass {
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
            console.error('project bll createTable error:', e);
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
            console.error('project bll fetch error:', e);
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
            console.error('project bll temp_add error:', e);
        } finally {
            return result;
        }
    }
    /**
     * 分页查询记录
     * @param {number} [currpage=0] 当前页 
     * @param {number} [pagesize=0] 页面尺寸
     * @param {number} [id] 项目索引（搜索用）
     * */
    async get(params) {
        const _this = this;
        let result = {
            code: $ErrorCode.DB_FAILED,
            rows: []
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
            if (params.id != undefined) {
                // searchs.id = {
                // 	$e: params.id,
                // 	table: 'projects'
                // };
                whereRow += `WHERE id = ${params.id}`;
            }
            let sorts = [{
                'id': 1
            }];
            result = await dbi.get({
                offset,
                limit,
                columns,
                searchs,
                sorts,
                whereRow,
            });
        } catch (e) {
            console.error('project bll get error:', e);
        } finally {
            return result;
        }
    }
    // 添加项目
    async add(params = {}) {
        const _this = this;
        let result = {
            code: $ErrorCode.ADD_FAILED,
            // msg: "",
        };
        try {
            // ...是否有判重的业务逻辑
            result = await dbi.add(params);
        } catch (e) {
            console.error('project bll add error:', e);
        } finally {
            return result;
        }
    }
    /**
     * 编辑项目
     * 状态切换
     * 	   并赋值
     * 	   未赋值
     * 状态未切换
     * 		赋值
     * 		未赋值
     * */
    async set({
        id,
        name = null,
        status,
        describe = null,
        estimateTime = null,
        estUnit = null,
        createTime = null,
        startTime = null,
        completeTime = null
    }: { id?, status?, name?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?, realityTime?}) {
        const _this = this;
        let result: { code: number, msg?: string } = {
            code: $ErrorCode.SET_FAILED,
            msg: "",
        };
        try {
            let rv = await dbi.fetchById(id);
            if (rv.code == $ErrorCode.SUCCESS && rv.rows.length == 1) {
                let prevPro = rv.rows[0];
                // let now = Date.now();
                let now = $moment().unix();
                let row: { id, status?, name?, describe?, estimateTime?, estUnit?, createTime?, startTime?, completeTime?, realityTime?} = { id };
                // row.id = id;
                row.status = status;
                if (name != null) {
                    row.name = name;
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

                if (prevPro.status == 0 && row.status == 1) {
                    // 由未开始切到正在进行
                    if (startTime != null) {
                        row.startTime = startTime;
                    } else {
                        row.startTime = now;
                    }

                } else if (prevPro.status == 1 && row.status == 0) {
                    // 由正在进行切到未开始 （理论上不允许）
                    row.startTime = 0;
                } else if (prevPro.status == 2 && row.status == 1) {
                    // 由已完成切到正在进行（理论上不允许）
                    if (startTime != null) {
                        row.startTime = startTime;
                    } else {
                        row.startTime = now;
                    }
                    row.completeTime = 0;
                    row.realityTime = 0;
                } else if (prevPro.status == 1 && row.status == 2) {
                    // 由正在进行切到已完成
                    if (startTime != null && completeTime == null) {
                        row.startTime = startTime;
                        row.completeTime = now;
                        row.realityTime = row.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime != null && completeTime != null) {
                        row.startTime = startTime;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime == null && completeTime != null) {
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - prevPro.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else {
                        row.completeTime = now;
                        row.realityTime = row.completeTime - prevPro.startTime;// 实际耗时 = 完成时间 - 开始时间
                    }

                } else if (prevPro.status == 2 && row.status == 0) {
                    // 由已完成 切到 未开始（理论上不允许）
                    row.startTime = 0;
                    row.completeTime = 0;
                    row.realityTime = 0;
                } else if (prevPro.status == 0 && row.status == 2) {
                    // 由未开始 切到 已完成
                    if (startTime != null && completeTime == null) {
                        row.startTime = startTime;
                        row.completeTime = now;
                        row.realityTime = row.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime != null && completeTime != null) {
                        row.startTime = startTime;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime == null && completeTime != null) {
                        row.startTime = now;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else {
                        row.startTime = now;
                        row.completeTime = now;
                        row.realityTime = 0;
                    }
                } else if (prevPro.status == 0 && row.status == 0) {

                } else if (prevPro.status == 1 && row.status == 1) {
                    if (startTime != null) {
                        row.startTime = startTime;
                    }
                } else if (prevPro.status == 2 && row.status == 2) {
                    if (startTime != null && completeTime == null) {
                        row.startTime = startTime;
                        row.realityTime = prevPro.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime != null && completeTime != null) {
                        row.startTime = startTime;
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - row.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else if (startTime == null && completeTime != null) {
                        row.completeTime = completeTime;
                        row.realityTime = row.completeTime - prevPro.startTime;// 实际耗时 = 完成时间 - 开始时间
                    } else {
                    }
                }
                result = await dbi.set(row);
            } else {
                result.code = $ErrorCode.OBJECT_NOEXISTS;
                result.msg = `pro id = ${id} is not exist`;
                return
            }

            // console.log(JSON.stringify(rv));
        } catch (e) {
            console.error('project bll set error:', e);
        } finally {
            return result;
        }
    }

    /**
     * 删除项目
     * @param {object} params   
     * @param {array} [params.ids = []] 要删除的项目索引
     * */
    async remove({ ids = [] } = { ids: [] }) {
        const _this = this;
        let result = {
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
            console.error('project bll remove error:', e);
        } finally {
            return result;
        }
    }
}
