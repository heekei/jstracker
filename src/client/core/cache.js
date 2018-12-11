import md5 from 'js-md5';
import config from '../config';


const cache = {};
export default {
  /**
   * @description 检查Log是否重复,避免重复上报过多相同日志
   * @param {*} log
   * @param {*} timestamp
   * @returns { {fully:Boolean, hash:String, repeatNum:Number} }
   * @memberof jstracker
   */
  checkCache(log, timestamp) {
    const str = JSON.stringify(log);
    const hash = md5(str);
    let fully = false;
    if (cache[hash]) {
      /* 缓冲区已满，删除最早的日志 */
      if (cache[hash].length >= config.repeatNum) {
        fully = true;
        cache[hash].shift();
      }
      cache[hash].push({
        log,
        timestamp,
      });
    } else {
      cache[hash] = [{
        log,
        timestamp,
      }];
    }
    return {
      fully,
      hash,
      repeatNum: cache[hash].length,
    };
  },
};
