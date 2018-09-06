# JStracker

> a simple error tracker hook.

## 开发模式
> gulp

## 启动数据服务器的两种方法

1. 如果使用VS CODE，直接按 ```F5```

2. node build/server/index.js

## 使用

- node环境使用client下的jstracker.js
- 浏览器环境使用build下的jstracker.js

```js
var data = {
    system: 'os',
    ip: '127.0.0.1',
    plat: 'xxx'
};
jstracker.report('eventName', data);
```
具体使用方式，可参考 `client/test.js` 文件