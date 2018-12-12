// pages/answer/answer.js
var network = require("../../utils/request.js");
const app = getApp();
var nums = require("../../utils/timestamp.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollData:[],
    selindex:0,
    scroll:false,
    page:1,
    pageSize:5,
    answerList:[],
    noMore:false,
    totalPage:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTagList();
  },
  //获取标签名
  getTagList:function(){
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'question/getTagList',
      {
        
      }, '', function (res) {
        let data = res.data.questionTag;
        data = data.split(',');
        that.getTagContentList(data[0]);
        that.setData({
          scrollData: data
        })
      });
  },
  //获取标签内容
  getTagContentList: function (tag) {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('POST', app.globalData.requestUrl + 'question/list',
      {
        titleTag:tag,
        customerId: app.globalData.customerId,
        page: that.data.page,
        pageSize: that.data.pageSize
      }, '', function (res) {
        let data = res.data.list;
        for(let i in data){
          data[i].answerCount = nums.numFormat(data[i].answerCount)
          data[i].followCount = nums.numFormat(data[i].followCount)
        }
        that.setData({
          answerList: that.data.answerList.concat(data),
          isLoad:false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize)
        },function(){
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        })
      },function(){
        that.setData({
          isLoad:false
        })
      });
  },
  onReachBottom: function () {
    console.log(9999)
    var that = this;
    //最后一页不请求
    if (that.data.totalPage == that.data.page) {
      return
    }
    that.setData({
      page: that.data.page + 1,
    }, function () {
      that.getTagContentList();
    })
  },

  onPageScroll: function (e) {
    if (e.scrollTop >= 150) {
      this.setData({
        scroll: true
      })
    }
    else {
      this.setData({
        scroll: false
      })
    }
  },
  setSelIndex: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    if (index == that.data.selindex){
      return
    }
    this.setData({
      selindex: index,
      answerList:[],
      page:1
    },function(){
      that.getTagContentList(that.data.scrollData[index]);
    })
  },
  //提问
  ask:function(){
      wx.navigateTo({
        url: '/pages/ask/ask',
      })
  },
  //详情
  seeDetails:function(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/answerDetails/answerDetails?contentId='+id,
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
      if (app.globalData.ask) {
        app.globalData.ask=false;
        this.getTagList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})