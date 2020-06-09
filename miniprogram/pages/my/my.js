import util from '../../js/util.js'

Page({
  data: {
    userInfo:{},
    loginBool: false,
    signBool: false,
    signDate: '',
    signcount: 0,
    lv: 1
  },
  onLoad: function (options) {
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      wx.hideLoading()

      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                _this.setData({
                  userInfo: res.userInfo,
                })
              },
              fail(err) {
                console.log(err)
              }
            })
          }
        }
      })
    },1000)

    wx.cloud.callFunction({
      //云函数名称
      name: 'get_signdate',

      //成功执行的方法
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        if (res.result.data.length > 0){
          _this.data.signDate = res.result.data[0].date
          _this.setData({
            signcount: res.result.data[0].num
          })
          console.log('res ==> ', res.result.data[0].num);
        }

        _this.LvCount(res.result.data[0].num)

        var date = util.formatDate(new Date())[0]
        if (_this.data.signDate === date) {
          _this.setData({
            signBool: true
          })
        } else {
          _this.setData({
            signBool: false
          })
        }
        console.log(_this.data.signBool)
        console.log(res)
      },
      //失败执行的方法
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },
  LoginBtn: function(){
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    

    setTimeout(function () {
      wx.hideLoading()

      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                console.log(res.userInfo)
                _this.setData({
                  userInfo: res.userInfo,
                  loginBool: true
                })
              },
              fail(err) {
                console.log(err)
              }
            })
          }
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                _this.setData({
                  userInfo: res.userInfo,
                  loginBool: true
                })
              },
              fail(err) {
                console.log(err)
              }
            })
          }
        }
      })
      _this.setData({
        loginBool: true
      })
    }, 2000)
    console.log(_this.data.userInfo)
  },

  SignBtn: function(){
    var _this = this
    wx.showLoading({
      title: '加载中...'
    })
    wx.showToast({
      title: '签到成功',
    })
    var date = util.formatDate(new Date())[0]
    console.log(_this.data.signDate)
    if(_this.data.signDate){
      var count = _this.data.signcount++
      console.log(count)
      wx.cloud.callFunction({
        name: 'update_signdate',
        data: {
          date: date,
          num: _this.data.signcount ++
        },
        success: res => {
          wx.hideLoading();
          _this.setData({
            signBool: true
          })
          
          console.log('res ==> ', res);
        },
        fail: err => {
          wx.hideLoading();
          console.log('出错了 err ==> ', err);
        }
      })
    }else{
      wx.cloud.callFunction({
        name: 'add_signdate',
        data: {
          _id: 'asd123456789',
          date: date,
          num: 1
        },
        success: res => {
          wx.hideLoading();
          _this.setData({
            signBool: true
          })
          console.log('res ==> ', res, _this.data.signBool);
        },
        fail: err => {
          wx.hideLoading();
          console.log('出错了 err ==> ', err);
        }
      })
    }
    wx.cloud.callFunction({
      name: 'get_signdate',
      success: res => {
        if (res.result.data.length > 0) {
          _this.setData({
            signcount: res.result.data[0].num
          })
          console.log('res ==> ', res.result.data[0].num);
        }
      }
    })
    _this.LvCount(_this.data.signcount)
  },
  LvCount: function(res){
    var _this = this
    if (res > 1 && res <= 5) {
      _this.setData({
        lv: 1
      })
    } else if (res > 5 && res <= 10) {
      _this.setData({
        lv: 2
      })
    } else if (res > 10 && res <= 15) {
      _this.setData({
        lv: 3
      })
    } else if (res > 15 && res <= 20) {
      _this.setData({
        lv: 4
      })
    } else if (res > 20 && res <= 25) {
      _this.setData({
        lv: 5
      })
    } else if (res > 25 && res <= 30) {
      _this.setData({
        lv: 6
      })
    } else if (res > 30) {
      _this.setData({
        lv: 7
      })
    }
  },
  CloseLogin: function(){
    var _this = this
    wx.showLoading({
      title: '注销中',
    })
    setTimeout(function(){
      wx.hideLoading()
      wx.showToast({
        title: '已退出！',
      })
      _this.setData({
        loginBool: false
      })
    },1000)
  }
})