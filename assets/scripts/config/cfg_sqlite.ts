export default {
    // filename: "test.db",
    filename: "dbs/test.db",
    projname: "UseSqlite3", // 项目名称，模拟器运行使用，防止模拟器开多个项目误用db
    baseversion: "v20220516001",// 初始版本，定好后就别改了
    lastversion: "v20220516003",// 最新版本
    versions:[
        {prev:"v20220516001",version:"v20220516002"},
        {prev:"v20220516002",version:"v20220516003"},
    ]
}