var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = []; 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    Nalongitude: '',
    Nalatitude: '',
    longitude: '',
    latitude: '',
    markers:[{
      markers: [],
      id: 1,
      latitude: 0,
      longitude: 0,
    }],
    polyline: [{
      points: [{
        longitude: 0,
        latitude: 0
      }, {
        longitude: 0,
        latitude: 0
      }],
      color: "#FF0000DD",
      width: 4,
      dottedLine: true
    }],
    regAddress:{},
    inputValue:''
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    var BMap = new bmap.BMapWX({
      ak: 'pHnR8t2C82uuesipVhYpVMvu67AjbsRs'
    }); 
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data)
      wxMarkerData = data.wxMarkerData;
      var str = wxMarkerData[0].address.slice(3,6)
      console.log(str)
      _this.setData({
        markers: wxMarkerData,
        Nalatitude: wxMarkerData[0].latitude,
        latitude: wxMarkerData[0].latitude,
        Nalongitude: wxMarkerData[0].longitude,
        longitude: wxMarkerData[0].longitude,
        regAddress:{
          address: str
        }
      })
      wx.cloud.callFunction({
        name: 'add_locationCity',
        data: {
          _id: 'asd123456789',
          city: str,
          address: wxMarkerData[0].address
        },
        success: res => {
          console.log(res)
        },
        fail: err => {
          console.log(err)
        }
      })
    }
      BMap.regeocoding({
        fail: fail,
        success: success
      }); 

    wx.getLocation({
      success: function(res) {
        console.log(res)
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers:[{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      },
    })
  },

  CitySearch: function(e){
    var _this = this
    this.setData({
      inputValue: e.detail.value
    })
  },

  CitySearchBtn: function(){
    var _this = this
    var BMap = new bmap.BMapWX({
      ak: 'pHnR8t2C82uuesipVhYpVMvu67AjbsRs'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      _this.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude
      })
    }
    // 发起geocoding检索请求 
    BMap.geocoding({
      address: _this.data.inputValue,
      fail: fail,
      success: success
    }); 

    this.setData({
      regAddress:{
        address: _this.data.inputValue,
      }
    })
  },

  RouteBtn: function(){
    var _this = this 
    // wx.openLocation({
    //   type: 'g02',
    //   latitude: _this.data.latitude,
    //   longitude: _this.data.longitude,
    //   scale: 28,
    //   name: _this.data.inputValue,
    //   address: _this.data.address
    // })
    this.setData({
      polyline: [{
        points: [{
          longitude: _this.data.Nalongitude,
          latitude: _this.data.Nalatitude
        }, {
          longitude: _this.data.longitude,
          latitude: _this.data.latitude
        }],
        color: "#FF0000DD",
        width: 4,
        dottedLine: true
      }]
    })
  }
})