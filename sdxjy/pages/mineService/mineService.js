// pages/mineService/mineService.js
var network = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      serviceData:'',
      loadBox:true,
      height: '',
      width: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  getData: function () {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'member/getProductService',
      {

      }, '', function (res) {
        that.setData({
          aboutData: res.data
        }, function () {
          that.setData({
            loadBox: false
          })
        })
      });
  },
  change: function (e) {
    this.setData({
      height: e.detail.height,
      width: e.detail.width
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