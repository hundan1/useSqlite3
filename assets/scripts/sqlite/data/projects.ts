// 2020-11-19
const data = [{"id":"_1605501420736","name":"项目管理系统","describe":"项目的增删改查","createTime":1605501420736,"startTime":1603500000000,"completeTime":1603554300000,"estimateTime":"8","realityTime":"00 天 15 时 05 分 00 秒","status":2,"estUnit":0,"realUnit":0,"task":{"list":[{"id":"_1605503325006","name":"重大bug1","describe":"新建项目造成之前项目任务丢失，复现步骤：在项目中建任务，返回项目列表，新建项目，建的任务丢失。原因：返回页面未重新获取数据。解决方法：（不携带参数）onShow里面获取数据","category":2,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605503325006,"startTime":1605527400000,"completeTime":1605529661463,"estimateTime":"2","realityTime":"00 天 00 时 37 分 42 秒","status":2,"estUnit":0,"realUnit":0},{"id":"_1605530727134","name":"重大bug2","describe":"新建任务后，删除有子任务的任务，删除错误，退出再进，显示异常，问题已定位，由子任务系统解决。","category":2,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605530727134,"startTime":1605530730665,"completeTime":1605531283431,"estimateTime":"0.25","realityTime":"00 天 00 时 09 分 13 秒","status":2,"estUnit":0,"realUnit":0},{"id":"_1605532214320","name":"溢出隐藏长按显示全部","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532214320,"startTime":"","completeTime":"","estimateTime":"1","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533509072","name":"项目类型划分","describe":"","category":1,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533509072,"startTime":"","completeTime":"","estimateTime":"2","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533607562","name":"支持筛选、搜索框","describe":"可以用选项卡、树状菜单代替","category":0,"subTaskId":"_1605533509072","cates":["新增需求","项目优化","修复bug"],"createTime":1605533607562,"startTime":"","completeTime":"","estimateTime":"2","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533640912","name":"任务管理系统","describe":"任务的增删改查","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533640912,"startTime":"","completeTime":"","estimateTime":"8","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533733273","name":"项目、任务暂停","describe":"支持暂停任务，如在某些时候开发了一半想延后开发","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533733273,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533878565","name":"编辑异常","describe":"编辑项目、任务异常","category":2,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533878565,"startTime":"","completeTime":"","estimateTime":"0.5","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533947627","name":"_","describe":"任务预计耗时单位支持分钟","category":1,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533947627,"startTime":"","completeTime":"","estimateTime":"0.5","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605534099639","name":"定时器跳秒","describe":"","category":2,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605534099639,"startTime":"","completeTime":"","estimateTime":"1","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605534451906","name":"子任务系统","describe":"可被树状菜单、选项卡替换，或配合使用","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605534451906,"startTime":"","completeTime":"","estimateTime":"8","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605534502594","name":"任务类型颜色区分","describe":"","category":0,"subTaskId":"_1605533640912","cates":["新增需求","项目优化","修复bug"],"createTime":1605534502594,"startTime":"","completeTime":"","estimateTime":"1","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605534761334","name":"任务、项目相互转换","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605534761334,"startTime":"","completeTime":"","estimateTime":"6","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605535708269","name":"下边框分割线","describe":"滚动离分割线有点距离","category":1,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605535708269,"startTime":"","completeTime":"","estimateTime":"0.5","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1606741193037","name":"新增类型","describe":"任务类型可以自己增加","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1606741193037,"startTime":"","completeTime":"","estimateTime":"2","realityTime":"","status":0,"estUnit":0,"realUnit":0}]}},{"id":"_1605531930981","name":"国际化","describe":"","createTime":1605531930981,"startTime":1605531932110,"completeTime":1605531932413,"estimateTime":"2","realityTime":"00 天 00 时 00 分 01 秒","status":2,"estUnit":0,"realUnit":0,"task":{"list":[{"id":"_1605531959903","name":"标题、tabbar国际化","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605531959903,"startTime":1605531960905,"completeTime":1605531961199,"estimateTime":"2","realityTime":"00 天 00 时 00 分 01 秒","status":2,"estUnit":0,"realUnit":0},{"id":"_1605532058736","name":"自定义国际化","describe":"（开发者模式下）自定义词、页面、模块文字国际化","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532058736,"startTime":"","completeTime":"","estimateTime":"2","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605532147626","name":"国际化文件的识别和导出","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532147626,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0}]}},{"id":"_1605532258240","name":"备份系统","describe":"项目数据备份和读档","createTime":1604149858000,"startTime":1605412200000,"completeTime":1605428400000,"estimateTime":"4","realityTime":"00 天 04 时 30 分 00 秒","status":2,"estUnit":0,"realUnit":0,"task":{"list":[{"id":"_1605532462100","name":"自动备份","describe":"设置自动备份开关，时间间隔","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532462100,"startTime":"","completeTime":"","estimateTime":"3","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605532538875","name":"模块化","describe":"各个模块分开备份，（考虑子模块的备份）","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532538875,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605532596518","name":"文件导入导出","describe":"备份文件的导入导出（建议模块化任务完成再搞）","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532596518,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605534912058","name":"操作按钮点击效果","describe":"","category":1,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605534912058,"startTime":"","completeTime":"","estimateTime":"0.5","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605534986203","name":"覆盖操作","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605534986203,"startTime":"","completeTime":"","estimateTime":"0.5","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605535003936","name":"删除操作","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605535003936,"startTime":"","completeTime":"","estimateTime":"0.5","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1606970182678","name":"存储类型转换","describe":"local storage -> plus. sqlite","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1606970182678,"startTime":1609038353231,"completeTime":"","estimateTime":"2","realityTime":"","status":1,"estUnit":0,"realUnit":0}]}},{"id":"_1605532711162","name":"游戏模块（首页）","describe":"简易人物信息渲染，战斗","createTime":1605532711162,"startTime":1603354800000,"completeTime":1603360500000,"estimateTime":"3","realityTime":"00 天 01 时 35 分 00 秒","status":2,"estUnit":0,"realUnit":0,"task":{"list":[{"id":"_1605532925968","name":"失误插件","describe":"npc技能命中失误，平A失误","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532925968,"startTime":"","completeTime":"","estimateTime":"2","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605532998184","name":"碰撞实验室","describe":"概率模拟，大数据比对，是否符合真实概率","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605532998184,"startTime":"","completeTime":"","estimateTime":"6","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533073210","name":"弹幕插件","describe":"npc场合弹幕（垃圾话），低级智能","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533073210,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533107634","name":"SL插件","describe":"可以对游戏进行存读档","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533107634,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605533337892","name":"自建RGB","describe":"可以选择图片，设置文字（音乐），后期奔拖拽式开发（仿react、app-develop、海川那个）","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605533337892,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1605535569969","name":"仿冒险村","describe":"武器、防具、道具、怪副本、村民","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605535569969,"startTime":1606741393980,"completeTime":"","estimateTime":"8","realityTime":"","status":1,"estUnit":0,"realUnit":0},{"id":"_1605659067836","name":"颜色插件","describe":"不同物体，不同颜色","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605659067836,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0}]}},{"id":"_1605534699303","name":"仿mysql数据管理系统","describe":"将数据结构模仿成mysql，方便升级，等开发操作记录，第一版（数据增删改查）","createTime":1605534699303,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0,"task":{"list":[{"id":"_1605534806480","name":"操作日志记录","describe":"","category":0,"subTaskId":0,"cates":["新增需求","项目优化","修复bug"],"createTime":1605534806480,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0}]}},{"id":"_1605535247081","name":"操作提示","describe":"toast","createTime":1605535247081,"startTime":1605774180000,"completeTime":1605791304880,"estimateTime":"3","realityTime":"00 天 04 时 45 分 25 秒","status":2,"estUnit":0,"realUnit":0},{"id":"_1605659031756","name":"颜色设置","describe":"可以自主设置颜色，主题色","createTime":1605659031756,"startTime":"","completeTime":"","estimateTime":"6","realityTime":"","status":0,"estUnit":0,"realUnit":0},{"id":"_1606970260970","name":"开发者模式","describe":"开发环境下，一些系统操作，如数据库操作失败提示","createTime":1606970260970,"startTime":"","completeTime":"","estimateTime":"4","realityTime":"","status":0,"estUnit":0,"realUnit":0}];
export default data;