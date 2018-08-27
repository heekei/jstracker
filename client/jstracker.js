(function () {
    'use strict';
    var axios = require('./libs/axios');

    if (!axios) {
        console.warn('Please importing Axios before JStracker!');
        return;
    }

    function jstracker() {
        wx.getNetworkType({
            success: function (network) {
                wx.request({
                    url: jstracker.config.server,
                    method: 'POST',
                    data: {
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
                    },
                    success: function (res) {
                        console.log('res: ', res);
                    },
                    fail: function (err) {
                        console.log('err: ', err);
                    },
                });
            }
        });
    }

    jstracker.config = {
        server: 'http://localhost:38364',
    };
    jstracker.setConfig = function (options) {
        jstracker.config = options = Object.assign(jstracker.config, options);
    };

    /**
     * 记录事件
     *
     * @param {function|string} EventName 事件名称：
     * @param {*} data 数据
     */
    jstracker.track = function (EventName, data) {
        var clientTimestamp = new Date().toLocaleString(); //记录客户端时间
        EventName = typeof EventName === 'function' ? EventName.name : EventName; //如果事件名称变量是一个函数，则取函数名称
        axios.post(`${this.config.server}`, {
            EventName,
            data,
            clientTimestamp
        });
    };

    /**
     * export jstracker
     */
    var _global = (function () {
        return this || (0, eval)('this');
    }());
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jstracker;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return jstracker;
        });
    } else {
        !('jstracker' in _global) && (_global.jstracker = jstracker);
    }
})();