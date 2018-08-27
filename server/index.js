const express = require('express');
const request = require('request');

const jsonServer = require('json-server');
const jsonServerConfig = require('./json-server.config.js');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    if (req.method == 'OPTIONS') res.send(200); /*让options请求快速返回*/
    else next();
});
app.post('/', function (req, res) {
    var sa = {
        reqHeader: req.headers,
        ip: getClientIp(req),
        timestamp: new Date().toLocaleString(),
        event: req.body
    };
    request.post(`http://localhost:${jsonServerConfig.port}/logs`, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        json: sa
    }, function (error) {
        if (error) {
            res.send(500, error.toString());
            return;
        }
        res.send(200, {
            code: 1
        });
    });
});

app.listen(38364, function () {
    console.log('app listening on port 38364!');
});


/**
 * 获取客户端IP
 *
 * @param {Request} req
 * @returns
 */
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
}

const server = jsonServer.create();
const router = jsonServer.router(jsonServerConfig.router);
const middlewares = jsonServer.defaults();
server
    .use(middlewares)
    .use(router)
    .listen(jsonServerConfig.port, function () {
        console.log(`JSON Server is running on port ${jsonServerConfig.port}`);
    });