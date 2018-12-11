var  jstracker = require('../dist/jstracker');

// const jstracker = new JSTracker({
//   server: 'http://127.0.0.1:38364',
// });
jstracker.init({ server: 'http://127.0.0.1:38364' });
function fn1(a, b) {
  return {
    global: this,
    a,
    b,
  };
}
jstracker.trigger(fn1, ['1', '2']);
