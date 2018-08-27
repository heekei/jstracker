(function () {
    'use strict';
    const axios = require('axios');

    if (!axios) {
        console.warn('Please importing Axios before JStracker!');
        return;
    }
    /**
     *
     *
     * @param {*} envInfo 基础信息
     */
    let jstracker = function (envInfo) {
        axios.post(jstracker.config.server, envInfo, {
            headers: {
                interface: 'infos'
            }
        });
    };

    /**
     * 配置项
     */
    jstracker.config = {
        /**
         * 上报服务器
         */
        server: 'http://localhost:38364',
    };

    /**
     * 设置配置项
     *
     * @param {*} options 配置项
     */
    jstracker.setConfig = function (options) {
        if (options && options.toString() === '[object Object]') {
            jstracker.config = options = Object.assign(jstracker.config, options);
        }
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
        axios.post(this.config.server, {
            EventName,
            data,
            clientTimestamp
        }, {
            headers: {
                interface: 'events'
            }
        });
    };

    module.exports = jstracker;
})();