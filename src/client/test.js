import JSTracker from './jstracker';
// var JSTracker = require('./jstracker');
// var _defer = require('q');
import {
  defer as _defer
} from 'q';

function getMoney(wallet) {
  return wallet.total();
}

function envInfoUpload() {
  var defer = _defer();
  try {
    wx.getNetworkType({
      success: function (network) {
        var envInfo = {
          system: wx.getSystemInfoSync(),
          network: network,
          detail: network,
          storage: wx.getStorageSync(),
          tmaconfig: {
            appId: TMAConfig.appId,
            appLaunchInfo: TMAConfig.appLaunchInfo
          },
          curPage: {
            options: getCurrentPages()[getCurrentPages().length - 1].options,
            url: getCurrentPages()[getCurrentPages().length - 1].__route__,
          }
        };
        defer.resolve(envInfo);
      }
    });

  } catch (error) {
    jstracker.collect({
      name: '这是一个基础环境信息'
    });
    jstracker.report('wx.getNetworkType', {
      message: error.message,
      stack: error.stack
    });
    defer.reject();
  }
  return defer.promise;
}

let jstracker = new JSTracker({
  server: 'http://127.0.0.1:38364'
});
envInfoUpload().then(function (info) {
  jstracker.collect(info);
});

try {
  getMoney({});
} catch (error) {
  jstracker.report(getMoney, {
    message: error.message,
    stack: error.stack
  });
}
function fn1(a, b) {
  this.a=1;
  return {
    global: this,
    a: a,
    b: b
  };
}
let re = jstracker.trigger(fn1, ['1', '2']);
console.log('re: ', re);
