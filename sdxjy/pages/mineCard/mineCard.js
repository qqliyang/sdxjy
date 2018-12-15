// pages/mineCard/mineCard.js
//获取应用实例
var network = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromJz:false,//是否来自讲座报名
    mineData:'',
    loadBox:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //来自讲座报名
      if (options.jz) {
          this.setData({
            fromJz:true 
          })
      }
      //来自约聊
      if (options.isChart){
          this.setData({
            fromJz: true
          })
      }

      this.getUserMess();
  },
  
  //获取个人信息
  getUserMess: function (province, city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.setData({
          loadBox:false,
          mineData:res.data,
          customerName: res.data.customerName ? res.data.customerName:'',
          phone: res.data.phone ? res.data.phone:'',
          address: res.data.address ? res.data.address:'',
        })
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  //保存输入内容
  setCustomerName:function(e){
      this.setData({
        customerName:e.detail.value
      })
  },
  setPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  //保存信息
  saveMineMess: function (e) {
    var that = this;
    console.log(999)
    if (this.data.customerName == '') {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
      })
      return
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入您的电话',
        icon: 'none',
      })
      return
    }
    if (this.data.phone.length < 11) {
      wx.showToast({
        title: '电话格式不对',
        icon: 'none',
      })
      return
    }
    if (this.data.address == '') {
      wx.showToast({
        title: '请输入您的联系地址',
        icon: 'none',
      })
      return
    }
   
    network.requestLoading('GET', app.globalData.requestUrl + '/member/updateCustomInfo',
      {
        customerId: app.globalData.customerId,
        customerName: that.data.customerName,
        phone: that.data.phone,
        address: that.data.address,
      }, '', function (res) {
          wx.showToast({
            title: '保存成功',
          })
          setTimeout(function(){
            if (that.data.fromJz) {
              wx.navigateBack({})
            }
          },1000)
      })
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