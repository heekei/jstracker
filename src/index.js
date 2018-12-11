import jstracker from './client/tracker';

jstracker.init({
  server: 'http://127.0.0.1:38364',
  offlineOpt: {
    getOfflineLogs() {
      console.log(1);
    },
    setOfflineLog(log) {
      console.log(log);
    },
  },
});

function fn1(a, b) {
  return {
    global: this,
    c: a,
    b,
  };
}
jstracker.trigger(fn1, [global, '2', '']);
console.log('res: ', res);
console.log(jstracker);
