var jstracker = require('./jstracker');
var Promise = require('q');

function getMoney(wallet) {
    return wallet.total();
}

function envInfoUpload() {
    var defer = Promise.defer();
    try {
        wx.getNetworkType({
            success: function (network) {
                var envInfo = {
                    system: wx.getSystemInfoSync(),
                    network: network,
                    detail: network,
                    storage: wx.getStorageSync(),
                    tmaconfig: {
                        appId: TMAConfig.appId,
                        appLaunchInfo: TMAConfig.appLaunchInfo
                    },
                    curPage: {
                        options: getCurrentPages()[getCurrentPages().length - 1].options,
                        url: getCurrentPages()[getCurrentPages().length - 1].__route__,
                    }
                };
                defer.resolve(envInfo);
            }
        });

    } catch (error) {
        jstracker({
            name: '这是一个基础环境信息'
        });
        jstracker.track('wx.getNetworkType', {
            message: error.message,
            stack: error.stack
        });
        defer.reject();
    }
    return defer.promise;
}

jstracker.setConfig({
    server: 'http://127.0.0.1:38364'
});

envInfoUpload().then(function (info) {
    jstracker(info);
});

try {
    getMoney({});
} catch (error) {
    jstracker.track(getMoney, {
        message: error.message,
        stack: error.stack
    });
}