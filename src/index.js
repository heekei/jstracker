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
  const res = {
    global: this,
    a,
    b,
  };
  console.log('res: ', res);
  return res;
}

jstracker.trigger(fn1, [1, 2]);
