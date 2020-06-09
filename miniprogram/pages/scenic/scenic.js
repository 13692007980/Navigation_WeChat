Page({
  data: {
    locationCity: ''
  },
  onLoad: function (options) {
    var _this = this

    wx.showLoading({
      title: '加载中',
    }),
    wx.cloud.callFunction({
      name: 'get_locationCity',
      success: res => {
        wx.hideLoading()
        console.log(res)
        _this.setData({
          locationCity: res.result.data[0].city
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  }
})