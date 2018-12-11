export default {
  /**
   * 上报服务器
   */
  server: 'http://localhost:38364',
  /**
   * 启用离线日志
   */
  offline: false,
  /**
   * 离线功能是否可用
   */
  offlineEnable: false,
  /**
   * 离线日志相关配置
   */
  offlineOpt: {
    /**
     * 离线日志保留时间,单位：天
     */
    offlineExp: 5,

    /**
     * @description 自定义获取离线日志的方法
     * @returns {[]} 日志数组
     */
    getOfflineLogs: null,
    /**
     * @description 自定义设置离线日志的方法
     * @param log 需要设置的日志
     * @returns
     */
    setOfflineLog: null,
  },
  /**
   * 缓存区单条日志重复次数
   */
  repeatNum: 5,
};
