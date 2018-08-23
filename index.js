const express = require('express');
const request = require('request');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/', function (req, res) {
    var sa = {
        system: req.body.system,
        network: req.body.network,
        detail: req.body.detail
    };
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
    console.log('Example app listening on port 8080!');
});