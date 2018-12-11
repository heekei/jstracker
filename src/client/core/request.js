import axios from 'axios';
/**
   * @description 自定义ajax请求方法
   * @param {string} url 接口地址
   * @param {*} data 日志数据
   * @param {{}} option 用来附加请求header
   * @returns Promise
   * @memberof jstracker
   */
export default (url, data, option) => axios.post(url, data, option);
