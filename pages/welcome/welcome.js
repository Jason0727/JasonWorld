Page({
    onTapJump: function (event) {
        wx.switchTab({
            url: "../say/say",
            success: function () {
                // console.log("jump success")
            },
            fail: function () {
                // console.log("jump failed")
            },
            complete: function () {
                // console.log("jump complete")
            }
        });
    },
    onUnload: function (event) {
        // console.log("page is unload")
    },
    //小程序从前台进入后台
    onHide: function (event) {
        // console.log("page is hide")
    },
})