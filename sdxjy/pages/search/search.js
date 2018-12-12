// pages/search/search.js
const app = getApp();
var network = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
      page:1,
      pageSize:15,
      contentDesc:'',
      articleList:[],
      isLoad:false,
      isResult:false,
      totalRow:null,
      msg:'换个条件试试'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  setInput:function(e){
      this.setData({
        contentDesc:e.detail.value
      })
  },
  deleteInput:function(){
      this.setData({
        contentDesc:''
      })
  },
  startSearch:function(){
      var that = this;
      this.setData({
         articleList:[],
         page:1,
      },function(){
         that.search();
      })
  },
  //搜索
  search:function(){
      var that = this;
      that.setData({
        isLoad:true,
        noMore: false,
        isResult:true,
      })
      network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentList',
      {
        page:that.data.page,
        pageSize: that.data.pageSize,
        contentDesc: that.data.contentDesc
      }, '', function (res) {
        that.setData({
          articleList: that.data.articleList.concat(res.data.list),
          isLoad:false,
          totalRow:res.data.totalRow,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize)
        },function(){
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }

          //把搜索内容传到数据里 高亮作为key需要
          for(let i in that.data.articleList){
            (that.data.articleList)[i].key = that.data.contentDesc;
          }
          that.setData({
            articleList: that.data.articleList
          })
        })
      },function(){
        that.setData({
          isLoad:false
        })
      });         
  },
  //查看详情
  seeDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleDetails/articleDetails?contentId=' + id,
    })
  },

  cancle:function(){
      wx.switchTab({
        url: '/pages/index/index',
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
        that.search();
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})