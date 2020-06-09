var bmap = require('../../libs/bmap-wx.js'); 
Page({
  data: {
    weatherData: '',
    temperature: '',
    weatherAll: []
  },
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function(){
      wx.hideLoading()
    }, 2000)
    var BMap = new bmap.BMapWX({
      ak: 'pHnR8t2C82uuesipVhYpVMvu67AjbsRs'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var weatherAll = data.originalData.results[0].weather_data
      console.log(weatherAll)
      var str = weatherData.temperature
      str = str.replace(/\s*/g, '')

      str = str.substring(3)
      _this.setData({
        weatherData: weatherData,
        temperature: str,
        weatherAll: weatherAll
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 
  }
})