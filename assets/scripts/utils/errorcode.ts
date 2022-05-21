export default {
    SUCCESS: 0,                                  // 请求成功
    FAILED: -1,                                  // 请求失败
    ROUTER_FAILED: 2,                            // 路由错误
    DB_FAILED: 3,                                // 数据库操作失败
    SESSION_NOEXISTS: 4,                         // session不存在
    SOCKET_FAILED: 5,                            // socket 失败
    OBJECT_NOEXISTS: 6,                          // 目标不存在
    OBJECT_EXISTS: 7,                            // 目标已经存在
    OBJECT_NO_PERMISSION: 8,                     // 目标操作没有权限
    PARAMS_FAILED: 9,                            // 参数不正确
    CAPTCHA_FAILED: 10,                          // 验证码不正确
    REPEAT_LOGIN_FAILED: 12,                     // 登录失败次数过多，请稍候后重试
    DB_INIT_FAILED: 13,                          // 数据库初始化失败
    DB_UPDATE_FAILED: 14,                        // 数据库升级失败


    U_NOEXISTS: 101,                             // 用户不存在
    U_PASSWORD_FAILED: 102,                      // 密码不正确
    U_NO_PERMISSION: 103,                        // 没有权限
    U_OFFLINE: 104,                              // 不在线
    U_ONLINE: 105,                               // 已经在线
    DEL_FAILED: 106,                             // 删除操作失败
    SET_FAILED: 107,                             // 设置操作失败
    ADD_FAILED: 108,                             // 添加操作失败
    OP_LIMIT:301,                                // 操作限制
}
