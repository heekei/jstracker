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
  EventName: fn.name,
  data: 'trigger'
}) {
  if (reportTrigger) {
    report(...reportTrigger);
  }
  try {
    return fn.apply(null, args);
  } catch (error) {
    report(fn, error);
  }
}
