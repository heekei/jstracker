// const axios = require('axios');
import axios from 'axios';

class jstracker {
    /**
     * 创建jstracker实例.
     * @param {*}} options 配置项
     * @memberof jstracker
     */
    constructor(options) {
        this.cache = {};
        this.offlineEnable = false;

        this.config = {
            /**
             * 上报服务器
             */
            server: 'http://localhost:38364',
            /**
             * 启用离线日志
             */
            offline: false,
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
             * 缓存区日志重复次数
             */
            repeatNum: 5,
            /**
             * 自定义ajax请求方式
             */
            // request(url, data, option) {
            //     return Promise
            // }
        };
        this.init(options);
    }
    /**
     * @description 自定义ajax请求方法
     * @param {*} url 接口地址
     * @param {*} data 日志数据
     * @param {*} option 用来附加请求header
     * @returns Promise
     * @memberof jstracker
     */
    request(url, data, option) {
        return axios.post(url, data, option);
    }
    /**
     * @description 设置配置项
     * @param {*} options 配置项
     * @memberof jstracker
     */
    init(options) {
        if (options && options.toString() === '[object Object]') {
            // 覆盖默认配置
            this.config = options = Object.assign(this.config, options);

            // 覆盖ajax请求方法
            if (this.config.request && typeof this.config.request === 'function') {
                this.request = this.config.request;
            }

            // 离线功能启动
            let opt = this.config.offlineOpt;
            if (opt && typeof opt.getOfflineLogs === 'function' && typeof opt.setOfflineLog === 'function') {
                this.getOfflineLogs = opt.getOfflineLogs;
                this.setOfflineLog = opt.setOfflineLog;
                this.offlineEnable = true;
                if (this.config.offline) console.log('离线日志已启用');
            } else {
                if (this.config.offline) {
                    this.config.offline = false;
                    console.error('离线日志启动失败，请检查配置！已切换到实时日志。');
                }
            }
        }
    }
    /**
     * @description 基本信息或环境信息采集，可理解为访问日志。
     * @param {*} infos
     * @memberof jstracker
     */
    collect(infos) {
        let clientTimestamp = new Date().toLocaleString(); //记录客户端时间
        this.request(this.config.server, {
            infos,
            clientTimestamp
        }, {
            headers: {
                interface: 'infos'
            }
        });
    }
    /**
     * @description 上报事件
     * @param {function|string} EventName 事件名称
     * @param {*} data 数据
     * @memberof jstracker
     */
    report(EventName, data) {
        let clientTimestamp = new Date().toLocaleString(); //记录客户端时间
        EventName = typeof EventName === 'function' ? EventName.name : EventName; //如果事件名称变量是一个函数，则取函数名称
        let log = {
            EventName,
            data
        };
        if (!this.checkCache(log, clientTimestamp).fully) {
            if (this.config.offline && this.offlineEnable) {
                // TODO 离线存储
                this.setOfflineLog(log);
            } else {
                this.request(this.config.server, log, {
                    headers: {
                        interface: 'events'
                    }
                }).then((res) => {
                    console.log(`上报成功：${res}`);
                }, (err) => {
                    console.error(`实时上报失败: ${err}`);
                    if (this.offlineEnable) {
                        console.log('已将上报失败的日志转入离线日志');
                        this.setOfflineLog(log);
                    }
                });
            }
        }
    }
    /**
     * @description 检查Log是否重复
     * @param {*} log
     * @param {*} timestamp
     * @returns 
     * @memberof jstracker
     */
    checkCache(log, timestamp) {
        let str = JSON.stringify(log);
        let hash = this.toHash(str);

        /** 
         * 缓存是否达到限定次数 
         */
        let fully = false;
        if (this.cache[hash]) {
            if (this.cache[hash].length >= this.config.repeatNum) {
                fully = true;
                this.cache[hash] = this.cache[hash].reverse();
                this.cache[hash].length = this.config.repeatNum;
                this.cache[hash] = this.cache[hash].reverse();
            }
            this.cache[hash].push({
                log,
                timestamp
            });
        } else {
            this.cache[hash] = [{
                log,
                timestamp
            }];
        }
        return {
            fully,
            hash,
            repeatNum: this.cache[hash].length
        };
    }
    /**
     * 字符串转hash
     *
     * @param {*} str
     * @returns
     */
    toHash(str) {
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
}

export default jstracker;