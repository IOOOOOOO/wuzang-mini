import request from '../../helper/request'
import { setState, store } from '../../helper/wx'

Page({
  data:function(){
    return
  },
  data: {
    /*分页列表*/
    items: [],
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
    loading: false,//是否正在加载
    loadedAll: false,//是否加载完全部
     /*分页列表*/
    videoIndex: null,//当前播放视频
  },
  /**/
  setState,
  
  onLoad: function (options) {
    this.loadData();
  },
  /*01.加载数据*/
  loadData: function (e) {
    var that = this;
    if (that.data.loadedAll || that.data.loading) return;
    that.setData({ loading: true });
    request({ url: '/media', data: { media_type: 'video', page: that.data.pageIndex, per_page: that.data.pageSize } })
      .then(({ data, header }) => {
        that.data.totalPage = Number(header['X-WP-TotalPages']);
        that.setData({
          totalPage: that.data.totalPage,
          loadedAll: (that.data.pageIndex >= that.data.totalPage)
        });
        return Promise.resolve(data);
      })
      .then((data) => {
        // this.items = this.items.concat(data) 后期解决
        that.setData({ items: data });
      })
      .then(() => that.setData({ loading: false }));
  },
  /*02.刷新*/
  reLoadData: function (e) {
    var that = this;
    if (that.data.loading) return;
    that.setData({
      items: [],
      pageIndex: 1,
      totalPage: 0,
      loadedAll: false,
    });
    that.loadData();
  },
  /*03.记载更多*/
  loadMoreData: function (e) {
    var that = this;
    if (that.data.loadedAll || that.data.loading) return;
    that.setData({ pageIndex: ++that.data.pageIndex });
    that.loadData();
  },


  //播放视频
  videoPlay(event) {
    var length = this.data.items.length;
    var index = event.currentTarget.dataset['index'];

    if (!this.data.videoIndex) { // 没有播放时播放视频
      this.setData({
        videoIndex: index
      })
      var videoContext = wx.createVideoContext('video' + index)
      videoContext.play()
    } else {
      //停止正在播放的视频
      var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex)
      videoContextPrev.stop()
      //将点击视频进行播放
      this.setData({
        videoIndex: index
      })
      var videoContextCurrent = wx.createVideoContext('video' + index)
      videoContextCurrent.play()
    }
  },
  
})