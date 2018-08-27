# JStracker

> a simple error tracker hook.

## 开发模式
> gulp

## 启动钩子和数据服务器

> 如果使用VS CODE，直接按 ```F5``` 更佳

> node build/server/index.js

## 使用

```js
var info = {
    system: 'os',
    ip: '127.0.0.1',
    plat: 'xxx'
};
jstracker(info);
```

```js
var data = {
    system: 'os',
    ip: '127.0.0.1',
    plat: 'xxx'
};
jstracker.track('eventName', data);
```