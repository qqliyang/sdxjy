// pages/mineAsk/mineAsk.js
//获取应用实例
var network = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    askData:[],
    page:1,
    pageSize:10,
    totalPage:'',
    msg:'暂无提问问题',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  getData:function(){
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'member/getQuestionListByCustomId',
      {
        customerId: app.globalData.customerId,
        page:that.data.page,
        pageSize:that.data.pageSize
      }, '', function (res) {
        let data = res.data.list;
        for(let i in data){
          data[i].file = data[i].file ? data[i].file.split('@'):[];
        }
        that.setData({
          askData: that.data.askData.concat(data),
          totalRow: res.data.totalRow,
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize)
        },function(){
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
  //详情
  seeDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/answerDetails/answerDetails?contentId=' + id,
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