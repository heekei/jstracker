function jstracker() {
    wx.getNetworkType({
        success: function (network) {
            wx.request({
                url: 'http://172.20.31.6:8080/',
                method: 'POST',
                data: {
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
                },
                success: function (res) {
                    console.log('res: ', res);
                },
                fail: function (err) {
                    console.log('err: ', err);
                },
            })
        }
    });
}

export default jstracker;