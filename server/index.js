const express = require('express');
const request = require('request');

const jsonServer = require('json-server');
const config = require('./config.js');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method == 'OPTIONS') res.send(200); /*让options请求快速返回*/
    else next();
});
app.post('/', function (req, res) {
    var sa = {
        reqHeader: req.headers,
        ip: getClientIp(req),
        timestamp: new Date().toLocaleString(),
    };

    if (req.headers['interface'] &&
        req.headers['interface'].toString().trim() !== '') {
        sa[req.headers['interface']] = req.body; //可自定义接口，前提是在db.json中定义好
    } else {
        sa.default = req.body;
    }

    request.post(`http://localhost:${config.jsonServerPort}/${req.headers['interface']}`, {
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

app.listen(config.port, function () {
    console.log(`app listening on port ${config.port}!`);
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
const router = jsonServer.router(config.router);
const middlewares = jsonServer.defaults();
server
    .use(middlewares)
    .use(router)
    .listen(config.jsonServerPort, function () {
        console.log(`JSON Server is running on port ${config.jsonServerPort}`);
    });