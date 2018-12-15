// pages/mineAppointment/mineAppointment.js
var network = require("../../utils/request.js")
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     current: 0,
     askData:[],
     page:1,
     status:0,
     pageSize:10,
     loadBox:true,
     msg:'暂无相关内容',
     isTeacher:null,
     type: 'student',//teacher or student
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        isTeacher: options.isTeacher
      })
      this.getData();
  },
  //发起支付
  taskPay: function (e) {
    var that = this;
    let id =e.currentTarget.dataset.id;
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
        that.setData({
          askData:[],
          page:1,
        },function(){
          that.getData();
        })
      });
  },
  getData: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    let data='';
    //家长
    if (that.data.isTeacher ==0){
      data={
          fromCustomerid: app.globalData.customerId,
          page: that.data.page,
          userType: that.data.type,
          meetStatus: that.data.status,
          pageSize: that.data.pageSize
      }
    }
    else{
        data={
          toCustomerid: app.globalData.customerId,
          page: that.data.page,
          userType: that.data.type,
          meetStatus: that.data.status,
          pageSize: that.data.pageSize
        }
    }

    network.requestLoading('GET', app.globalData.requestUrl + 'meetRecord/list',
      data, '', function (res) {
        let data = res.data.list;
        that.setData({
          askData: that.data.askData.concat(data),
          totalRow: res.data.totalRow,
          isLoad: false,
          loadBox:false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize)
        }, function () {
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        })
      }, function () {
        that.setData({
          isLoad: false
        })
      })
  },
  //发表评价
  sendPj:function(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/beingEvaluated/beingEvaluated?id='+id,
      })
  },
  setCurrent: function (e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
  },
  current: function (e) {
    var that = this;
    this.setData({
      current: e.detail.current,
      status: e.detail.current,
      askData:[],
      page:1,
    },function(){
      that.getData();
    })
  },
  seeDetails:function(e){
      let obj = e.currentTarget.dataset.obj;
      console.log(obj)
      obj = JSON.stringify(obj);
      obj = encodeURIComponent(obj);
      wx.navigateTo({
        url: '/pages/mineAppointmentDetails/mineAppointmentDetails?obj='+obj,
      })
  },
  seeTeacherDetails:function(e){
      let obj = e.currentTarget.dataset.obj;
      obj = JSON.stringify(obj);
      obj = encodeURIComponent(obj);
      wx.navigateTo({
        url: '/pages/teacherMineAppointment/teacherMineAppointment?obj=' + obj,
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
    var that = this;
    if (app.globalData.appoint){
        app.globalData.appoint=false;
        that.setData({
          askData: [],
        }, function () {
          that.getData();
        })
    }
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
  lower: function () {
      var that = this;
      //最后一页不请求
      if (that.data.totalPage == that.data.page) {
        return
      }
      that.setData({
        page: that.data.page + 1,
      }, function () {
        that.getData();
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})