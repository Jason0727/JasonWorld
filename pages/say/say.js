var util = require('../../util/util.js')
Page({
    data: {
        says: [],//说说数据
        dataUrl: "https://api.smallzhou.cn/api/say",
        current_page: 1
    },
    onLoad: function () {
        this.requestSaysData(this.data.dataUrl);
    },
    requestSaysData: function (dataUrl) {
        var that = this;
        wx.request({
            url: dataUrl,
            method: 'GET',
            header: {
                "content-type": "json"
            },
            success: function (res) {
                var saysData = res.data;
                var says = [];
                for (var idx in saysData.data) {
                    var say = saysData.data[idx];
                    
                    var name = say.username;
                    if (name.length >= 15) {
                        name = name.substring(0, 6) + "...";
                    }
                    console.log(say.time);
                    var temp = {
                        id: say.id,
                        name: name,
                        created_at: util.getDiffTime(say.time,true),
                        avatar: say.avatar,
                        txt: say.txt,
                        imgs: say.imgs
                        // love: video.love,
                        // hate: video.hate,
                        // favourite: video.favourite,
                        // comment: video.comment,
                    }
                    says.push(temp);
                }
                
                var totalSays = []
                totalSays = that.data.says.concat(says);
                that.setData({
                    says: totalSays,
                    current_page: that.data.current_page + 1,
                    last_page: saysData.last_page
                });
            },
            fail: function () {
                // console.log("加载失败");
            },
            complete: function () {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
        })
    },
    //预览图片
    previewImg: function (event) {
        //获取说说序号
        var sayIdx = event.currentTarget.dataset.sayIdx;
        //获取图片在图片数组中的序号    
        var imgIdx = event.currentTarget.dataset.imgIdx;
        //获取说说的全部图片
        var imgAll = this.data.says[sayIdx].imgs;
        wx.previewImage({
            current: imgAll[imgIdx], // 当前显示图片的http链接
            urls: imgAll // 需要预览的图片http链接列表数组
        })
    },
    //下拉刷新(可多次触发)
    onPullDownRefresh: function (event) {
        //显示loading状态
        wx.showNavigationBarLoading();
        this.data.current_page = 1;
        var page = this.data.current_page;
        var refreshUrl = this.data.dataUrl +
            "?page=" + page + "&page_size=5";
        //刷新页面后将页面所有初始化参数恢复到初始值
        this.data.says = [];
        this.requestSaysData(refreshUrl);
        wx.stopPullDownRefresh();
    },
    //触底事件
    onReachBottom: function (event) {
        //显示loading状态
        wx.showNavigationBarLoading();
        var last_page = this.data.last_page;
        var page = this.data.current_page;
        //检测是否达到最大分页数
        if (page <= last_page) {
            //拼接下一组数据的URL
            var nextUrl = this.data.dataUrl +
                "?page=" + page + "&page_size=5";
            this.requestSaysData(nextUrl);
        }
    }
})