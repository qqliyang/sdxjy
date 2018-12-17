// pages/authority/authority.js
var network = require("../../utils/request.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.saveMineMess(e);
    }
    else { //用户按了拒绝按钮
      
    }
  },
  
  saveMineMess: function (e) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + '/member/updateCustomInfo',
      {
        customerId: app.globalData.customerId,
        locationName: '',
        wxPicurl: e.detail.userInfo.avatarUrl,
        wxUname: e.detail.userInfo.nickName
      }, '', function (res) {
        //res就是我们请求接口返回的数据
        wx.switchTab({
          url: '/pages/index/index',
        })
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