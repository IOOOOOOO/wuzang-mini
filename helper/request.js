import host from '../host'

export default function (params) {
  const {
    url,
    data = {},
    method = 'GET',
  } = params

  Object.keys(data).forEach((key) => {
    if (data[key] === null || data[key] === undefined) {
      delete data[key]
    }
  })

  return new Promise((resolve) => {
    //显示动画效果
    wx.showNavigationBarLoading();
    wx.showLoading({ mask: true });

    wx.request({
      url: `${host}/wp-json/wp/v2${url}`,
      data,
      method,
      success(data) {
        //清楚加载动画效果
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();

        if (data.data) {
          return resolve(data)
        }
        return 
        wx.showToast({
          title:"请求数据错误",
          icon: 'none',
          duration: 1000,
          mask: true,
        });
      }
    })
  })
}
