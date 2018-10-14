Page({
  data: {
    src: '',
  },

  onTap() {
    wx.previewImage({ current: '', urls: [this.data.src] })
  },
})
