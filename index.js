const express = require('express');
const request = require('request');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.post('/', function (req, res) {
    var sa = Object.assign(req.body, {
        reqHeader: req.headers,
        ip: getClientIp(req),
        timestamp: new Date().toLocaleString(),
    });
    request.post('http://localhost:8081/logs', {
        json: sa
    }, function (error, response, body) {
        if (error) res.send(500, error.toString());
        res.send(200, {
            code: 1
        });
    })
});

app.listen(8080, function () {
    console.log('app listening on port 8080!');
});

//传入请求HttpRequest
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
}