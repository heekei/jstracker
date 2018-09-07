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
             * 离线日志保留时间,单位：天
             */
            offlineExp: 5,
            repeatNum: 5
        };
        this.init(options);
    }
    /**
     * @description 设置配置项
     * @param {*} options 配置项
     * @memberof jstracker
     */
    init(options) {
        if (options && options.toString() === '[object Object]') {
            this.config = options = Object.assign(this.config, options);
        }

        // TODO: 离线功能
        if (this.config.offline) {
            if (window && window.indexedDB) {
                0;
            } else if (window && window.localStorage) {
                0;
            } else {
                this.config.offline = false;
                console.warn('Your browser doesn\'t support IndexedDB or localStorage. Offline logs will be close;');
            }
        }
    }
    /**
     * @description 基本信息或环境信息采集
     * @param {*} infos
     * @memberof jstracker
     */
    collect(infos) {
        let clientTimestamp = new Date().toLocaleString(); //记录客户端时间
        axios.post(this.config.server, {
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
        if (this.config.offline) {
            // TODO 离线存储
        } else {
            EventName = typeof EventName === 'function' ? EventName.name : EventName; //如果事件名称变量是一个函数，则取函数名称
            let log = {
                EventName,
                data
            };
            if (!this.checkCache(log, clientTimestamp).fully) {
                axios.post(this.config.server, log, {
                    headers: {
                        interface: 'events'
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