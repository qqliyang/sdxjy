// pages/answerDetails/answerDetails.js
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
    scrollId: 'top',
    infoData:[],
    height:0,
    autoFocus:false,
    contentId:'',
    page:1,
    pageNext:1,
    pageSize:10,
    totalRow:0,
    totalRowNext:0,
    plData:[],
    noMore:false,
    comment:'',
    loadBox:true,
    isFollow:false,
    msg:'暂无人回答',
    sortType: 'byTime',//byTime/byPraise/byCommente
    sortName:'按时间排序',
    isCallback:false,
    callBackObj:'',
    callBackIndex:'',//回复的第几个人
    callBacPlData:[],
    array: [{ name: 'byTime', value: '按时间排序' }, { name: 'byPraise', value: '按点赞数排序' }, { name: 'byCommente', value: '按回复数排序' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      contentId: options.contentId
    }, function () {
      that.getInfo();
      that.getPlList();
    })
  },
  //选择排序方式
  bindPickerChange:function(e){
     var that = this;
     this.setData({
       sortType:(this.data.array[e.detail.value]).name,
       sortName:(this.data.array[e.detail.value]).value,
       plData:[],
       page:1,
     },function(){
       that.getPlList();
     })
  },
  //获取详情
  getInfo: function () {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'question/info',
      {
        questionId: that.data.contentId,
        sourceId:app.globalData.customerId
      }, '', function (res) {
        that.setData({
          infoData: res.data,
          isFollow: res.data.myFollow,
          loadBox:false
        })
      });
  },
  Follow: function (e) {
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    //取消关注
    if (e.currentTarget.dataset.isfollow == "true") {
      this.cancleFollowClick();
    }
    //点击关注
    else {
      this.FollowClick();
    }
    this.setData({ 'tapTime': nowTime });
  },
  //点击关注
  FollowClick: function (id) {
    var that = this;
    console.log(99999,that.data)
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType:'a',
        behaviorEvent:'a2',
        targetId: that.data.contentId,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.setData({
          isFollow: "true",
        })
        wx.showToast({
          title: '已关注',
          icon: 'none'
        })
      });
  },
  //取消关注
  cancleFollowClick: function (id) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a2',
        targetId: that.data.contentId,
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
    network.requestLoading('POST', app.globalData.requestUrl + 'answer/list',
      {
        sortType: that.data.sortType,
        questionId: that.data.contentId,
        page: that.data.page,
        pageSize: that.data.pageSize,
        sourceId:app.globalData.customerId
      }, '', function (res) {
       
        let data = res.data.list;
        for (let i in data) {
          //IOS只识别2017/01/01这样的日期格式，
          data[i].createTime = (data[i].createTime).replace(/-/g, '/');
          data[i].createTime = time.timestampFormat(Date.parse(data[i].createTime) / 1000)
        }
        
        that.setData({
          plData: that.data.plData.concat(data),
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          totalRow: res.data.totalRow,
          totalRowFormat: time.numFormat(res.data.totalRow),
        }, function () {
          
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        }, function () {
          that.setData({
            isLoad: false,
          })
        })
      });
  },
  //查看回复评论
  getCallbackPlList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('POST', app.globalData.requestUrl + 'answerComment/list',
      {
        answerId: that.data.callBackObj.answerId,
        page: that.data.pageNext,
        pageSize: that.data.pageSize,
        sourceId: app.globalData.customerId
      }, '', function (res) {

        let data = res.data.list;
        for (let i in data) {
          //IOS只识别2017/01/01这样的日期格式，
          data[i].createTime = (data[i].createTime).replace(/-/g, '/');
          data[i].createTime = time.timestampFormat(Date.parse(data[i].createTime) / 1000)
        }
        that.setData({
          callBacPlData: that.data.callBacPlData.concat(data),
          isLoad: false,
          totalPageNext: Math.ceil(res.data.totalRow / that.data.pageSize),
          totalRowNext: res.data.totalRow,
          totalRowFormat: time.numFormat(res.data.totalRow),
        }, function () {

          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        }, function () {
          that.setData({
            isLoad: false,
          })
        })
      });
  },
  commitPl: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  //提交评论
  commitPlData: function (id) {
    var that = this;
    if (that.data.comment == "") {
      wx.showToast({
        title: '请输入评论',
        icon: 'none'
      })
      return
    }
    that.setData({
      plData: []
    })
    network.requestLoading('POST', app.globalData.requestUrl + 'answer/save',
      {
        answerContent: that.data.comment,
        questionId: that.data.contentId,
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.getPlList();
        //置空
        that.setData({
          comment: '',
        })
        //导航到评论顶部
        setTimeout(function () {
          that.setData({
            scrollId: 'plid'
          })
        }, 500)
      });
  },
  //提交回复评论
  commitCallbackPlData: function (id) {
    var that = this;
    if (that.data.comment == "") {
      wx.showToast({
        title: '请输入评论',
        icon: 'none'
      })
      return
    }
    that.setData({
      callBacPlData: []
    })
    network.requestLoading('POST', app.globalData.requestUrl + 'answerComment/save',
      {
        comment: that.data.comment,
        answerId: that.data.callBackObj.answerId,
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.getCallbackPlList();
        //置空

        //评论列表个数加一
        that.data.plData[that.data.callBackIndex].commentCount+=1;
        that.setData({
          comment: '',
          plData: that.data.plData
        })
        //导航到评论顶部
        setTimeout(function () {
          that.setData({
            scrollId: 'callbackPlid'
          })
        }, 500)
      });
  },
  // 
  articleClick: function (e) {
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
  //问答点赞
  plClickBtn: function (e) {
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    //取消
    if (e.currentTarget.dataset.ismypraise == "true") {
      this.cancleFollowPlClick(id, index);
    }
    //点击
    else {
      this.followPlClick(id, index);
    }
    this.setData({ 'tapTime': nowTime });
  },
  //问答点赞
  callBackZan: function (e) {
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    //取消
    if (e.currentTarget.dataset.ismypraise == "true") {
      this.callbackCancleFollowPlClick(id, index);
    }
    //点击
    else {
      this.callbackFollowPlClick(id, index);
    }
    this.setData({ 'tapTime': nowTime });
  },
  //问答回复点赞
  callBackplClickBtn: function (e) {
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    let id = e.currentTarget.dataset.id
    let index = this.data.callBackIndex;
    //取消
    if (e.currentTarget.dataset.ismypraise == "true") {
      this.cancleFollowPlClick(id, index);
    }
    //点击
    else {
      this.followPlClick(id, index);
    }
    this.setData({ 'tapTime': nowTime });
  },
  //给评论点赞
  followPlClick: function (id, index,) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b3',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.plData[index].myPraise = 'true'
        if (that.data.callBackObj != ''){
          that.data.callBackObj.myPraise = 'true';
          that.data.callBackObj.praiseCount = parseInt(that.data.callBackObj.praiseCount) + 1
        }
        that.data.plData[index].praiseCount = parseInt(that.data.plData[index].praiseCount) + 1

        
        that.setData({
          plData: that.data.plData,
          callBackObj: that.data.callBackObj
        })
        console.log(that.data.plData[index])
        wx.showToast({
          title: '已点赞',
          icon: 'none'
        })
      });
  },
  //给评论取消点赞
  cancleFollowPlClick: function (id, index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b3',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.plData[index].myPraise = 'false';
        if (that.data.callBackObj !=''){
          that.data.callBackObj.myPraise = 'false';
          that.data.callBackObj.praiseCount = parseInt(that.data.callBackObj.praiseCount)-1
        }
        that.data.plData[index].praiseCount = parseInt(that.data.plData[index].praiseCount) - 1
        that.setData({
          plData: that.data.plData,
          callBackObj: that.data.callBackObj
        })
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
      });
  },

  //给回复评论点赞
  callbackFollowPlClick: function (id, index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b5',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.callBacPlData[index].myPraise = 'true'
        that.data.callBacPlData[index].praiseCount = parseInt(that.data.callBacPlData[index].praiseCount) + 1


        that.setData({
          callBacPlData: that.data.callBacPlData,
        })
        wx.showToast({
          title: '已点赞',
          icon: 'none'
        })
      });
  },
  //给回复评论取消点赞
  callbackCancleFollowPlClick: function (id, index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'b',
        behaviorEvent: 'b5',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.callBacPlData[index].myPraise = 'false';
        that.data.callBacPlData[index].praiseCount = parseInt(that.data.callBacPlData[index].praiseCount) - 1
        that.setData({
          callBacPlData: that.data.callBacPlData,
        })
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
      });
  },
  //回复 
  callBack:function(e){
      let obj = e.currentTarget.dataset.obj;
      let index = e.currentTarget.dataset.index;
      var that = this;
      this.setData({
        isCallback:true,
        callBackIndex:index,
        callBackObj: obj,
        callBacPlData:[],
        pageNext:1,
      },function(){
        that.getCallbackPlList();
      })
  },
  close:function(){
      this.setData({
        isCallback: false,
        callBackObj:'',
      })
  },
  //下拉更多评论
  lower: function () {
    var that = this;
    //最后一页不请求
    if (that.data.totalRow == 0) {
      return
    }
    console.log(77777, that.data.totalPage, that.data.page)
    if (that.data.totalPage == that.data.page) {
      return
    }
    that.setData({
      page: that.data.page + 1,
    }, function () {
      that.getPlList();
    })
  },
  //回复下拉更多评论
  lowerCallback: function () {
    var that = this;
    //最后一页不请求
    if (that.data.totalRowNext == 0) {
      return
    }
    if (that.data.totalPageNext == that.data.pageNext) {
      return
    }
    console.log(8877777)
    that.setData({
      pageNext: that.data.pageNext + 1,
    }, function () {
      that.getCallbackPlList();
    })
  },
  setFocus: function () {
    this.setData({
      autoFocus: true
    })
  },
  focus: function (e) {
    this.setData({
      height: e.detail.height
    })
  },
  cancelEvent() {
    this.setData({
      height: 0,
      autoFocus: false,
    })
  },
  plClick: function () {
    if (this.data.scrollId == 'plid') {
      this.setData({
        scrollId: 'top'
      })
      return
    }
    this.setData({
      scrollId: 'plid'
    })
  },

  //邀请回答
  requestAnswer:function(){
      wx.navigateTo({
        url: '/pages/requestAnswer/requestAnswer?id=' + this.data.contentId,
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
      title: this.data.infoData.title,
      path: '/pages/index/index?type=answer' + "&contentId=" + this.data.contentId,
      success: (res) => {
        console.log("转发成功", this.data.contentId);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})