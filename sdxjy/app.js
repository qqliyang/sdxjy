//app.js
var network = require("./utils/request.js")
App({
  onLaunch: function () {
    var res = wx.getSystemInfoSync()
    this.globalData.topHeight = 64 + 'px'
    this.globalData.lineHeight = (64 - res.statusBarHeight) + 'px'
    this.globalData.paddingTop = res.statusBarHeight + 'px'
    this.globalData.clientHeight = (res.screenHeight - 64) * 2 - 100
    console.log(res)
    
    if (res.model == 'iPhone X') {
      this.globalData.topHeight = 88 + 'px'
      this.globalData.lineHeight = (88 - res.statusBarHeight) + 'px'
      this.globalData.clientHeight = (res.screenHeight - 88) * 2 - 100
    }
    if (res.platform == 'android') {
      this.globalData.lineHeight = (72 - res.statusBarHeight) + 'px'
      this.globalData.isAndroid=true;
      this.globalData.topHeight = 72 + 'px'
      this.globalData.clientHeight = (res.screenHeight - 72) * 2 - 100
    }
    console.log(88, this.globalData.isPhone)
    //提示更新需要1.9.0版本
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        wx.showModal({
          title: '更新失败！',
          content: '请手动删除小程序后重新打开。',
        })
      })
    }
    else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '使用更多小程序功能请在我的设置中更新微信版本后打开！',
        success: function (res) {
          if (res.confirm) {

          }
        }
      })
    }
  },
  //获取openid
  getOpenId: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            network.requestLoading('GET', that.globalData.requestUrl + 'cust/login', {
              regType: 'a',
              appid: 'wx602b0ff40d50e9c8',
              module: 'd',
              channel: 'miniprogram',
              regId: '',
              spCode: '',
              code: res.code
            }, '', function (res) {
              that.globalData.openId = res.data.subSourceId;
              that.globalData.customerId = res.data.customerId;
              let data = res.data.locationName;
              that.globalData.cityName = data;
              resolve(res);
            }, function (res) {
              wx.showToast({
                title: res.message,
              })
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    })
  },
  //通过微信内置获取地理位置信息，然后通过百度API获取省份名
  setProvince: function () {
    var that = this;
    var promise = new Promise(function (resolve, reject) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          // wx.showLoading({
          //   title: '地址更新中！',
          // })
          var longitude = res.longitude;
          var latitude = res.latitude;
          wx.request({
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=W1RWumzLKW3pETxlXggTFC1aIrP0XCWs&location=' + latitude + ',' + longitude + '&output=json',
            data: {},
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var cityData = res.data.result.addressComponent;
              //这里逻辑,新用户获取位置 老用户使用上次保存的位置
            
              if (that.globalData.cityName!=''){   
                resolve(that.globalData);
              }
              else{
                that.globalData.cityName = cityData.city;
                resolve(that.globalData);
              }
              wx.hideLoading();
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '地址更新失败,请手动设置！',
                showCancel:false,
                confirmText:'去设置',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/citySel/citySel',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              resolve(that.globalData);
              wx.hideLoading();
            },
          })
        },
        fail:function(res){
          reject()
        }
      })
    })
    return promise;
  },
  //保存formId
  sendFromId: function (id) {
      var that = this;
      wx.request({
        url: that.globalData.requestUrl + 'wxpush/saveFormidBatch',
        data: {
          openid: that.globalData.openId,
          formidBatch:id,
        },
        success: function (res) {
            console.log('保存成功')
        },
      })
  },
  globalData: {
    topHeight:'',
    lineHeight:'',
    clientHeight: '',
    openId:'', 
    customerId:'1270d2d3e35c47ae824e49600b3d49a6',//会员id
    paddingTop:'',
    recodeArr:[], //搜索记录 保留五条
    requestUrl:'http://47.93.178.23:8081/sdx-edu/',
    imgUrl: 'http://47.93.178.23:8081/sdx-edu',
    //requestUrl: 'http://192.168.31.141:8081/sdx-edu/',
    userId:'',  //用户id
    backTwo: false,
    phoneNumber:'phoneNumber', //手机号
    orgId:'',//组织id
    cityName:'',//所在城市
    ask:false, //提问过问答刷新
    indexFresh:false,//首页是否刷新
    userInfo:'',
    appoint:false,
    cityArr:'',//城市数据
    appId:'wx602b0ff40d50e9c8',
  }
})
