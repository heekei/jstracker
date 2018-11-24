(function () {
  'use strict';
  const axios = require('axios');

  if (!axios) {
    console.warn('Please importing Axios before JStracker!');
  }

  /**
   * 检查Log是否重复
   *
   * @param {*} log
   * @param {*} timestamp
   */
  function checkCache(log, timestamp) {
    let str = JSON.stringify(log);
    let hash = toHash(str);

    /**
     * 缓存是否达到限定次数
     */
    let fully = false;
    if (cache[hash]) {
      if (cache[hash].length >= config.repeatNum) {
        fully = true;
        cache[hash] = cache[hash].reverse();
        cache[hash].length = config.repeatNum;
        cache[hash] = cache[hash].reverse();
      }
      cache[hash].push({
        log,
        timestamp
      });
    } else {
      cache[hash] = [{
        log,
        timestamp
      }];
    }
    return {
      fully,
      hash,
      repeatNum: cache[hash].length
    };
  }

  /**
   * 字符串转hash
   *
   * @param {*} str
   * @returns
   */
  function toHash(str) {
    str += '';
    var arr = new Array,
      len = str.length;
    var arg = Math.SQRT2.toFixed(9) - 0;
    forEach(function (x) {
      arr[x] = 0;
    });
    for (var i = 0; i < str.length; i++) calc(str.charCodeAt(i));
    forEach(function (x) {
      arr[x] = arr[x].toString(16);
      if (arr[x].length < 2) arr[x] = '0' + arr[x];
    });
    arr.reverse();
    return arr.join('');

    function calc(nmb) {
      var c = nmb & 255,
        next = nmb >> 8;
      forEach(function (x) {
        var h = (x ? arr[x - 1] : 0) + arr[x] + x + len + c;
        h += (h / arg).toFixed(9).slice(-3) - 0;
        arr[x] = h & 255;
      });
      if (next > 0) calc(next);
    }

    function forEach(func) {
      for (var i = 0; i < 16; i++) func(i);
    }
  }

  /**
   * 配置项
   */
  let config = {
    /**
     * 上报服务器
     */
    server: 'http://localhost:38364',
    /**
     * 启用离线日志
     */
    offline: false,
    /**
     * 离线日志保留时间,单位：天
     */
    offlineExp: 5,
    repeatNum: 5
  };

  /**
   * 缓存区
   */
  let cache = {

  };

  /**
   * 设置配置项
   *
   * @param {*} options 配置项
   */
  let init = function (options) {
    if (options && options.toString() === '[object Object]') {
      config = options = Object.assign(config, options);
    }

    // TODO: 离线功能
    if (config.offline) {
      if (window && window.indexedDB) {
        0;
      } else if (window && window.localStorage) {
        0;
      } else {
        config.offline = false;
        console.warn('Your browser doesn\'t support IndexedDB or localStorage. Offline logs will be close;');
      }
    }
  };

  /**
   * 上报事件
   *
   * @param {function|string} EventName 事件名称：
   * @param {*} data 数据
   */
  let report = function (EventName, data) {
    let clientTimestamp = new Date().toLocaleString(); //记录客户端时间
    if (config.offline) {
      // TODO 离线存储
    } else {
      EventName = typeof EventName === 'function' ? EventName.name : EventName; //如果事件名称变量是一个函数，则取函数名称
      let log = {
        EventName,
        data
      };
      if (!checkCache(log, clientTimestamp).fully) {
        axios.post(config.server, log, {
          headers: {
            interface: 'events'
          }
        });
      }
    }
  };

  /**
   * 基本信息或环境信息采集
   *
   * @param {*} infos
   */
  let collect = function (infos) {
    let clientTimestamp = new Date().toLocaleString(); //记录客户端时间
    axios.post(config.server, {
      infos,
      clientTimestamp
    }, {
      headers: {
        interface: 'infos'
      }
    });
  };

  let jstracker = {
    config: config,
    cache: cache,
    init: init,
    report: report,
    collect: collect
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = jstracker;
  }
  if (typeof define === 'function' && define.amd) {
    define('jstracker', [], function () {
      return jstracker;
    });
  } else if (typeof window !== 'undefined') {
    window.jstracker = jstracker;
  }
})();
