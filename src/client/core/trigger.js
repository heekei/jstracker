import report from './report';

/**
 * @description 监控方法
 * @export
 * @param {function} fn
 * @param {*} args
 * @param {{}|false} reportTrigger
 * @property {String} reportTrigger.EventName
 * @property {*} reportTrigger.data
 * @returns
 */
export default function trigger(fn, args, reportTrigger = {
  eventName: fn.name,
  data: 'trigger',
}) {
  if (reportTrigger) {
    report(reportTrigger.eventName, reportTrigger.data);
  }
  try {
    return fn(...args);
  } catch (error) {
    console.log('error: ', error);
    report(fn, error);
    return error;
  }
}
