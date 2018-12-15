// pages/mineAnswer/mineAnswer.js
//获取应用实例
var network = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    page: 1,
    pageSize: 5,
    askData: [],
    loadBox: true,
    msg: '暂无相关内容',
    status: 0,//[0-待回答 1-已回答] 
    totalPage:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getData: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'member/getAnswerListByCustomId',
      {
        customerId: app.globalData.customerId,
        page: that.data.page,
        pageSize: that.data.pageSize,
        inviteStatus: that.data.status,
      }, '', function (res) {
        let data = res.data.list;
        for (let i in data) {
          data[i].questionFile = data[i].questionFile ? (data[i].questionFile.substring(0, data[i].questionFile.length - 1)).split('@') : [];
        }
        console.log(9999, data)
        that.setData({
          askData: that.data.askData.concat(data),
          totalRow: res.data.totalRow,
          isLoad: false,
          loadBox: false,
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
  goAnswer:function(e){
    let id = e.currentTarget.dataset.id;
    let inviteId = e.currentTarget.dataset.inviteid;
    wx.navigateTo({
      url: '/pages/answerDetails/answerDetails?contentId=' + id + "&inviteId=" + inviteId,
    })
  },
  //详情
  seeDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/answerDetails/answerDetails?contentId=' + id,
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
    }, function () {
      that.getData();
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
    this.getData();
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
    console.log(999, that.data.totalPage, that.data.page)
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