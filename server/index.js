const express = require('express');
const request = require('request');

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
    request.post('http://localhost:8081/logs', {
        json: sa
    }, function (error) {
        if (error) res.send(500, error.toString());
        res.send(200, {
            code: 1
        });
    });
});

app.listen(8080, function () {
    console.log('app listening on port 8080!');
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

var exec = require('child_process').exec;
var childPcs = exec('json-server -c ./server/json-server.json --watch ./server/db.json', function (err) {
    if (err) console.log(err);
});
childPcs.on('message', function (msg, sendHandle) {
    sendHandle.on('error', function (err) {
        console.warn('err: ', err);
    });
    console.log('sendHandle: ', sendHandle);
    console.log('msg: ', msg);
});
// childPcs.kill();