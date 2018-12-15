// pages/mineAppointmentDetails/mineAppointmentDetails.js
var network = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let data = decodeURIComponent(options.obj);
      data = JSON.parse(data);
      data.meetFile = data.meetFile ? (data.meetFile.substring(0, data.meetFile.length-1)).split('@'):[];
      this.setData({
        details:data
      })
  },
  copyTBL: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.details.meetNo,
      success: function (res) {
          wx.showToast({
            title: '订单号已复制',
            icon:'none',
          })
      }
    });
  },
  //发表评价
  sendPj: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/beingEvaluated/beingEvaluated?id=' + id,
    })
  },
  //发起支付
  taskPay: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    network.requestLoading('GET', app.globalData.requestUrl + 'meetRecord/payRequest',
      {
        payMethod: '3',
        orderId: id,
        openId: app.globalData.openId,
        appId: app.globalData.appId,
        returnUrl: '',
      }, '', function (res) {
        let data = res.data.orderResponseWx;
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'signType': data.signType,
          'paySign': data.paySign,
          'package': data.package,
          'success': function (res) {
            if (res.statusCode == 500) {
              wx.showToast({
                title: '服务器异常',
              })
              return;
            }
            wx.showToast({
              title: '支付成功',
            })
            that.notify(id, data.paySign);
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      })
  },
  //支付成功回调
  notify: function (id, sign) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'answerInvite/notify',
      {
        orderId: id,
        payFlag: 2,
        orderType: 5,
        sign: sign
      }, '', function (res) {
        setTimeout(function () {
          app.globalData.appoint = true;
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.details.meetFile;

    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})