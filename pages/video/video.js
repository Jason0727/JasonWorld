var app = getApp()
var util = require('../../util/util.js')
Page({
    data: {
        videos:[],//视频列表数据
        dataUrl: "https://api.smallzhou.cn/api/video",
        current_page:1,
        playId:'',//当前播放视频的ID,如"video1
    },
    onLoad: function (options) {
        this.requestVideosData(this.data.dataUrl);
    },
    //视频资源请求
    requestVideosData: function (dataUrl) {
        var that = this;
        wx.request({
            url: dataUrl,
            method: 'GET',
            header: {
                "content-type": "json"
            },
            success: function (res) {
                var videosData = res.data;
                var videos = [];
                for (var idx in videosData.data) {
                    var video = videosData.data[idx];
                    var name = video.name;
                    if (name.length >= 15) {
                        name = name.substring(0, 6) + "...";
                    }
                    var temp = {
                        id:video.id,
                        name: name,
                        created_at: util.getDiffTime(video.time,true),
                        profile_image: video.profile_image,
                        videouri: video.video_uri,
                        love: video.love,
                        hate: video.hate,
                        favourite: video.favourite,
                        comment: video.comment,
                        color: video.name_color
                    }
                    videos.push(temp);
                }
                var totalVideos = []
                totalVideos = that.data.videos.concat(videos);
                that.setData({
                    videos: totalVideos,
                    current_page: that.data.current_page+1,
                    last_page: videosData.last_page
                });
            },
            fail: function () {
                console.log('加载失败');
            },
            complete: function () {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
        })
    },
    //下拉重新加载初始化数据
  onPullDownRefresh: function (event) {
        this.data.current_page = 1;
        var page = this.data.current_page;
        var refreshUrl = this.data.dataUrl +
            "?page=" + page +"&page_size=2";
        //刷新页面后将页面所有初始化参数恢复到初始值
        this.data.videos = [];
        this.requestVideosData(refreshUrl);
    },

onReachBottom: function (event) {
    var last_page = this.data.last_page;
    var page = this.data.current_page;
    //检测是否达到最大分页数
    if(page <=last_page){
        //显示loading状态
        wx.showNavigationBarLoading();
        //拼接下一组数据的URL
        var nextUrl = this.data.dataUrl +
            "?page=" + page + "&page_size=2";
        this.requestVideosData(nextUrl);
    }
},
//播放当前视频，关闭已播放视频
videoPlay:function(e){
    var id = e.currentTarget.id;
    if(!this.data.playId){//当前没有视频播放
        this.setData({
            playId:id
        });
        this.videoContext = wx.createVideoContext(id);
        this.videoContext.play();
    }else{//当前有视频播放
        //停止已播放视频
        this.videoContextPrev = wx.createVideoContext(this.data.playId);
        this.videoContextPrev.seek(0);
        this.videoContextPrev.pause();
        //播放点击视频
        this.videoContextCurrent = wx.createVideoContext(id);
        this.videoContextCurrent.play();
        //设置播放中的视频ID
        this.setData({
            playId: id
        });
    }
}
})