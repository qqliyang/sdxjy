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
    pageSize:10,
    answerList:[],
    noMore:false,
    totalPage:'',
    searchKey:'',
    scrollBox:true,
    showDel:false,
    tag:'',
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
    network.requestLoading('GET', app.globalData.requestUrl + 'question/getTagList',
      {
        
      }, '', function (res) {
        let data = res.data.questionTag;
        data = data.split(',');
       
        that.setData({
          scrollData: data,
          tag: data[0]
        },function(){
          that.getTagContentList();
        })
      });
  },
  setSearchKey:function(e){
      this.setData({
        searchKey:e.detail.value
      })
  },
  search:function(){
    var that = this;
    if (this.data.searchKey==''){
      wx.showToast({
        title: '请输入关键字',
        icon:'none'
      })
      return
    }
    that.setData({
      answerList:[],
      scrollBox:false,
      tag:'热榜'
    },function(){
      that.getTagContentList()
    })
  },
  deleteInput:function(){
      var that = this;
      that.setData({
        showDel:false,
        page:1,
        scrollBox:true,
        answerList:[],
        searchKey: '',
        selindex: 0,
        tag:that.data.scrollData[0]
      },function(){
        that.getTagContentList()
      })
  },
  //获取标签内容
  getTagContentList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'question/list',
      {
        titleTag: that.data.tag,
        customerId: app.globalData.customerId,
        page: that.data.page,
        searchKey: that.data.searchKey,
        pageSize: that.data.pageSize
      }, '', function (res) {
        let data = res.data.list;
        if ((that.data.searchKey).length>0){
          that.setData({
            showDel: true
          })
        }
        for(let i in data){
          data[i].answerCount = nums.numFormat(data[i].answerCount);
          data[i].followCount = nums.numFormat(data[i].followCount);
          data[i].file = data[i].file ? data[i].file.split('@') : [];
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
      tag:that.data.scrollData[index],
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
      var that = thos;
      if (app.globalData.ask) {
        app.globalData.ask=false;
        that.setData({
          answerList:[],
          page:1,
          selindex:0,
        },function(){
          that.getTagList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})