// pages/articleDetails/articleDetails.js
var network = require("../../utils/request.js");
var WxParse = require('../../wxParse/wxParse.js');
var time = require("../../utils/timestamp.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    false: false,
    scrollId:'top',
    article:'',
    personMess:'',
    contentId:'',
    pageSize:2,//相关推荐
    plSize:10,//评论
    page:1,
    articleList:[],
    tapTime: '',
    isFollow:'',
    isPraise:'',  //是否给该文章点过赞
    sourceId:'', //来源id
    teacherCustomerId: '', //老师id
    comment:'',
    plData:[],
    isLoad:false,
    noMore:false,
    autoFocus:false,
    totalRow:0,//消息总数量
    msg: '暂无评论',
    height:0,
    loadBox:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      contentId: options.contentId
    },function(){
      that.getArticleListDetails();
      that.getPlList();
    })
  },
  //对应类型文章数据
  getArticleListDetails: function () {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentById',
      {
        contentId: that.data.contentId,
        sourceId:app.globalData.customerId,
      }, '', function (res) {
        that.setData({
          article:res.data,
          isPraise: res.data.myPraise,
        },function(){
          that.getCustomerById(res.data.customerId)
          that.getArticleTypeList(res.data.customerId)
          WxParse.wxParse('articles', 'html', res.data.contentDesc, that, 5);
        })
      });
  },
  //对应会员id获取用户信息
  getCustomerById: function (id){
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: id
      }, '', function (res) {  
        that.setData({
          personMess:res.data,
          sourceId: app.globalData.customerId,//来源id
          teacherCustomerId: res.data.customerId //老师id
        }) 
        that.getIsFollow(res.data.customerId);
      });
  },
  //相关推荐
  getArticleTypeList: function (id) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentList',
      {
        customerId:id,
        page: 1,
        pageSize: that.data.pageSize,
      }, '', function (res) {
        let data = res.data.list
        for (let i in data) {
          data[i].contentType = (data[i].contentType.split(','))[0]
        }
        that.setData({
          articleList: that.data.articleList.concat(data),
          loadBox:false,
        })
      });
  },
  //是否关注
  getIsFollow: function (id) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerList',
      {
        page: 1,
        pageSize: 1,
        sourceId: app.globalData.customerId,
        customerId: id
      }, '', function (res) {
        that.setData({
          isFollow: res.data.list[0].myFollow,
        })
      });
  },
  Follow:function(e){
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    //取消关注
    if (e.currentTarget.dataset.isfollow == "true"){
      this.cancleFollowClick();
    }
     //点击关注
    else{
      this.FollowClick();
    }
    this.setData({ 'tapTime': nowTime });
  },
  //点击关注
  FollowClick: function (id) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType:'a',
        behaviorEvent: 'a1',
        targetId: that.data.teacherCustomerId,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.setData({
          isFollow: "true",
        })
        wx.showToast({
          title: '已关注',
          icon:'none'
        })
      });
  },
  //取消关注
  cancleFollowClick: function (id) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a1',
        targetId: that.data.teacherCustomerId,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.setData({
          isFollow: "false",
        })
        wx.showToast({
          title: '已取消关注',
          icon: 'none'
        })
      });
  },
  //查看评论
  getPlList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'comment/getCommentList',
      {
        contentId: that.data.contentId,
        isOpen: 1,
        sourceId: app.globalData.customerId,
        page: that.data.page,
        pageSize:that.data.plSize
      }, '', function (res) {
        let data =res.data.list;
        for(let i in data){
          //IOS只识别2017/01/01这样的日期格式，
          data[i].createTime = (data[i].createTime).replace(/-/g, '/'); 
          data[i].createTime = time.timestampFormat(Date.parse(data[i].createTime) / 1000)
        }
      
        that.setData({
          plData:that.data.plData.concat(data),
          isLoad:false,
          totalPage: Math.ceil(res.data.totalRow / that.data.plSize),
          totalRow: res.data.totalRow,
          totalRowFormat: time.numFormat(res.data.totalRow),
        },function(){
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        },function(){
          that.setData({
            isLoad: false,
          })
        })
      });
  },
  commitPl:function(e){
      this.setData({
        comment:e.detail.value
      })
  },
  //提交评论
  commitPlData: function (id) {
      var that = this;
      if (that.data.comment == ""){
          wx.showToast({
            title: '请输入评论',
            icon:'none'
          })
          return
      }
      that.setData({
        plData:[]
      })
      network.requestLoading('POST', app.globalData.requestUrl + '/comment/addComment',
      {
        comment: that.data.comment,
        isOpen: 1,
        contentId: that.data.contentId,
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.getPlList();
        //置空
        that.setData({
          comment:'',
        })
        //导航到评论顶部
        setTimeout(function () {
          that.setData({
            scrollId: 'plid'
          })
        }, 500)
      });
  },
  // 
  articleClick:function(e){
      //禁止连续点击
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
        return;
      }
      //取消
      if (e.currentTarget.dataset.ispraise == "true") {
       this.cancleFollowArticleClick();
      }
      //点击
      else {
       this.followArticleClick();
      }
      this.setData({ 'tapTime': nowTime });
  },
  //给文章点赞
  followArticleClick: function (id) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b4',
        targetId: that.data.contentId,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.setData({
          isPraise: "true",
        })
        wx.showToast({
          title: '已点赞',
          icon: 'none'
        })
      });
  },
  //给文章取消点赞
  cancleFollowArticleClick: function (id) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b4',
        targetId: that.data.contentId,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.setData({
          isPraise: "false",
        })
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
      });
  },
  plClickBtn:function(e){
      //禁止连续点击
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
        return;
      }
     let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
      //取消
      if (e.currentTarget.dataset.ismypraise == "true") {
        this.cancleFollowPlClick(id,index);
      }
      //点击
      else {
        this.followPlClick(id,index);
      }
      this.setData({ 'tapTime': nowTime });
  },
  //给评论点赞
  followPlClick: function (id,index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b2',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.plData[index].myPraise = 'true'
        that.data.plData[index].praiseCount = parseInt(that.data.plData[index].praiseCount)+1
        
        that.setData({
          plData: that.data.plData,
        })
        console.log(that.data.plData[index])
        wx.showToast({
          title: '已点赞',
          icon: 'none'
        })
      });
  },
  //给评论取消点赞
  cancleFollowPlClick: function (id,index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b2',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.plData[index].myPraise = 'false'
        that.data.plData[index].praiseCount = parseInt(that.data.plData[index].praiseCount)-1
        that.setData({
          plData: that.data.plData,
        })
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
      });
  },
  //下拉更多评论
  lower: function () {
    var that = this;
    //最后一页不请求
    if (that.data.totalRow == 0) {
      return
    }
    if (that.data.totalPage == that.data.page) {
      return
    }
    that.setData({
      page: that.data.page + 1,
    }, function () {
      that.getPlList();
    })
  },

  //查看相关推荐
  seeDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleDetails/articleDetails?contentId=' + id,
    })
  },
  
  
  setFocus:function(){
      this.setData({
        autoFocus:true
      })
  },
  focus: function (e) {
    this.setData({
      height: e.detail.height,
    })
  },
 
  cancelEvent() {
    this.setData({
      height: 0,
      autoFocus:false,
    })
  },
  plClick:function(){
     if (this.data.scrollId =='plid'){
        this.setData({
          scrollId: 'top'
        })
        return
      }
      this.setData({
        scrollId:'plid'
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
    return {
      title: this.data.article.contentTitle,
      path: '/pages/index/index?type=share' +"&contentId="+this.data.contentId,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})