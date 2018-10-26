import request from '../../helper/request'

Page({
  data: {

    /*分页列表*/
    items: [],
    pageIndex: 1,
    pageSize: 20,
    totalPage: 0,
    loading: false,//是否正在加载
    loadedAll: false,//是否加载完全部
     /*分页列表*/
  },
  onPullDownRefresh() {
    this.reLoadData();
  },
  onReachBottom() {
    this.loadMoreData();
  },
  onLoad() {
    this.loadData();
  },
  /*01.加载数据*/
  loadData: function (e) {
    var that = this;
    if (that.data.loadedAll || that.data.loading) return;
    that.setData({ loading: true });
    request({ url: '/media', data: { media_type: 'image',page: that.data.pageIndex, per_page: that.data.pageSize } })
      .then(({ data, header }) => {
        that.data.totalPage = Number(header['X-WP-TotalPages']);
        that.setData({
          totalPage: that.data.totalPage,
          loadedAll: (that.data.pageIndex >= that.data.totalPage)
        });
        return Promise.resolve(data);
      })
      .then((data) => {
        that.setData({ items: that.data.items.concat(data) });
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



  /*点击放大图片*/
  onTap({ target }) {
    const { src } = target.dataset
    wx.previewImage({
      current: src,
      urls: this.items
        .filter(({ post }) => post)
        .map(({ media_details }) => media_details.sizes.full.source_url)
    })
  },
})
