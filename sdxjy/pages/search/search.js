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
      loadBox:true,
      totalRow:null,
      msg:'换个条件试试'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchContent();
  },
  setInput:function(e){
      this.setData({
        contentDesc:e.detail.value
      })
  },
  deleteInput:function(){
      this.setData({
        contentDesc:'',
        isResult:false,
        articleList:[],
        page:1,
      })
  },
  startSearch:function(){
      var that = this;
      if (that.data.contentDesc == '') {
        wx.showToast({
          title: '请输入关键字',
          icon: 'none'
        })
        return
      }
      this.setData({
         articleList:[],
         page:1,
      },function(){
         that.search();
      })
  },
  //获取热搜和历史搜索
  getSearchContent:function(){
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'hotword/list',
      {
        sourceType: 'a',//搜索来源[a-圣达信教育 b-新高考 c-自主招生] 
        sourceSubType: 'a',//来源子栏目[a-资讯搜索 b-课程搜索 c-问答搜索] 
        customerId:app.globalData.customerId,
      }, '', function (res) {
        that.setData({
          searchData:res.data,
          loadBox:false,
        })
      })
  },
  setSearchVal:function(e){
    let val = e.currentTarget.dataset.val;
    var that = this;
    this.setData({
      articleList: [],
      page: 1,
      contentDesc:val,
    }, function () {
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
        that.saveSearchContent();
        let data =res.data.list;
        //把搜索内容传到数据里 高亮作为key需要
        for (let i in data) {
          data[i].key = that.data.contentDesc;
        }
        that.setData({
          loadBox:false,
          articleList: that.data.articleList.concat(data),
          isLoad:false,
          totalRow:res.data.totalRow,
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
  //保存历史搜索
  saveSearchContent: function () {
    var that = this;
    network.requestLoading('post', app.globalData.requestUrl + 'hotword/save',
      {
        scopeType:0,
        sourceType: 'a',//搜索来源[a-圣达信教育 b-新高考 c-自主招生] 
        sourceSubType: 'a',//来源子栏目[a-资讯搜索 b-课程搜索 c-问答搜索] 
        searchWord:that.data.contentDesc,
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.getSearchContent();
      })
  },
  //删除热搜和历史搜索
  deleteSearchContent: function () {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'hotword/delete',
      {
        sourceType: 'a',//搜索来源[a-圣达信教育 b-新高考 c-自主招生] 
        sourceSubType: 'a',//来源子栏目[a-资讯搜索 b-课程搜索 c-问答搜索] 
        customerId: app.globalData.customerId,
      }, '', function (res) {
         that.data.searchData.history=[];
         that.setData({
           searchData: that.data.searchData
         })
      })
  },
  //删除历史搜索
  delete:function(){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '是否删除历史搜索',
        success:function(res){
          if(res.confirm){
             that.deleteSearchContent();
          }
          else{
              console.log('取消删除')
          }
        }
      })
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