// pages/mine/mine.js
var network = require("../../utils/request.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTeacher:null,  //家长还是老师端  0家长 1是老师
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo;
    this.setData({
      userInfo: userInfo
    })
    this.getIsTeacher();
  },
  //判断老师端 还是家长端
  getIsTeacher: function () {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.setData({
          isTeacher: res.data.isTeacher
        })
      })
  },
  //我的名片
  goMineCard:function(){
      wx.navigateTo({
        url: '/pages/mineCard/mineCard',
      })
  },
  //我的提问
  goMineAsk: function () {
    wx.navigateTo({
      url: '/pages/mineAsk/mineAsk',
    })
  },
  //我的回答
  gomineAnswer: function () {
    wx.navigateTo({
      url: '/pages/mineAnswer/mineAnswer',
    })
  },
  //我的预约
  goMineAppointmentDetails: function () {
    wx.navigateTo({
      url: '/pages/mineAppointment/mineAppointment',
    })
  },
  //我的关注
  goMineCard: function () {
    wx.navigateTo({
      url: '/pages/mineCard/mineCard',
    })
  },
  //产品服务
  goMineCard: function () {
    wx.navigateTo({
      url: '/pages/mineCard/mineCard',
    })
  },
  //关于圣达信
  goMineCard: function () {
    wx.navigateTo({
      url: '/pages/mineCard/mineCard',
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