import request from './request';
import cache from './cache';
import config from '../config';

const { checkCache } = cache;
/**
 * @description 上报事件
 * @param {function|string} EventName 事件名称
 * @param {*} data 数据
 * @memberof jstracker
 */
export default (eventName, data) => {
  const clientTimestamp = +new Date(); // 记录客户端时间戳
  const log = {
    eventName,
    data,
  };
  const checkCacheResult = checkCache(log, clientTimestamp);
  if (!checkCacheResult.fully) {
    if (config.offline && config.offlineEnable) {
      config.offlineOpt.setOfflineLog(log);
    } else {
      request(config.server, log).then((res) => {
        console.log(`上报成功：${res}`);
      }, (err) => {
        console.error(`实时上报失败: ${err}`);
        if (config.offlineEnable) {
          console.log('已将上报失败的日志转入离线日志');
          config.offlineOpt.setOfflineLog(log);
        }
      });
    }
  } else {
    console.log('缓存区满了');
  }
};
