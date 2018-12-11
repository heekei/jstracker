// import axios from 'axios';
// import md5 from 'js-md5';
import request from './core/request';
import report from './core/report';
import trigger from './core/trigger';
// import cache from './core/cache';
import config from './config';

function jstracker() {
  return {
    /**
     * @description 设置配置项
     * @param {*} options 配置项
     * @memberof jstracker
     */
    init(options) {
      if (options && options.toString() === '[object Object]') {
        // 覆盖默认配置
        Object.assign(config, options);
        // 离线功能初始化
        const opt = config.offlineOpt;
        if (opt && typeof opt.getOfflineLogs === 'function' && typeof opt.setOfflineLog === 'function') {
          this.getOfflineLogs = opt.getOfflineLogs;
          this.setOfflineLog = opt.setOfflineLog;
          config.offlineEnable = true; // 离线功能可用
          // config.offlineEnable = true;
          if (config.offline) console.log('离线日志已启用');
        } else if (config.offline) {
          config.offline = false;
          console.error('离线日志启动失败，请检查配置！已切换到实时日志。');
        }
      }
    },
    request,
    report,
    trigger,
  };
}
export default jstracker();
