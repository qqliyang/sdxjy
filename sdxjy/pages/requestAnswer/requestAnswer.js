// pages/requestAnswer/requestAnswer.js
var network = require("../../utils/request.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current:1,
    id:'',
    teacherData:[],
    page:1,
    pageSize:4,
    type:1,
    isFollow:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      this.setData({
        id: 1
      },function(){
        that.getTotalTeacher();
      })
  },
  //
  lower:function(){
      var that = this;
      //最后一页不请求
      if (that.data.totalPage == that.data.page) {
        return
      }
      that.setData({
        page: that.data.page + 1,
      }, function () {
        that.getTotalTeacher();
      })
  },
  //到老师个人空间
  seePersonPage: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personPage/personPage?id=' + id,
    })
  },
  //邀请回答
  payInvite:function(e){
      var that = this;
      let invite = e.currentTarget.dataset.invite;
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      if(invite){
        wx.showToast({
          title: '您已邀请过了',
          icon:'none',
        })
      }
      else{
        //免费邀请
        if(that.data.current ==0){
           that.inviteTask(id,index);
        }
      }
  },
  inviteTask:function(id,index){
    var that = this;
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    network.requestLoading('POST', app.globalData.requestUrl + 'answerInvite/save',
      {
        questionId: that.data.id,
        inviteType: that.data.type,
        fromCustomerId: app.globalData.customerId,
        toCustomerId:id,
      }, '', function (res) {
        wx.showToast({
          title: '已邀请',
        })
        that.data.teacherData[index].myInvite=1;
        that.setData({
            teacherData: that.data.teacherData,
            tapTime: nowTime
        })
      });
  },
  Follow: function (e) {
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    let index = e.currentTarget.dataset.index;
    console.log('index', index)
    //取消关注
    if (e.currentTarget.dataset.isfollow == "true") {
      this.cancleFollowClick(e.currentTarget.dataset.id, index);
    }
    //点击关注
    else {
      this.FollowClick(e.currentTarget.dataset.id, index);
    }
    this.setData({ 'tapTime': nowTime });
  },
  //点击关注
  FollowClick: function (id, inx) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a1',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.teacherData[inx].myFollow = 'true';
        that.data.teacherData[inx].followCount += 1
        that.setData({
          teacherData: that.data.teacherData,
        })
        wx.showToast({
          title: '已关注',
          icon: 'none'
        })
      });
  },
  //取消关注
  cancleFollowClick: function (id, inx) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a1',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {

        that.data.teacherData[inx].myFollow = 'false';
        that.data.teacherData[inx].followCount -= 1
        that.setData({
          teacherData: that.data.teacherData,
        })
        wx.showToast({
          title: '已取消关注',
          icon: 'none'
        })
      });
  },
  //讲座详情
  getTotalTeacher: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'answerInvite/getAnswerInviteTeacherList',
      {
        questionId: that.data.id,
        inviteType: that.data.type,
        fromCustomerId: app.globalData.customerId,
        page:that.data.page,
        pageSize: that.data.pageSize
      }, '', function (res) {
        that.setData({
          teacherData: that.data.teacherData.concat(res.data.list),
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          totalRow: res.data.totalRow,
        },function(){
          let data = that.data.teacherData;
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
          for(let i in data){
              if(that.data.current == 1){
                if (data[i].myInvite==0){
                  data[i].inviteName = data[i].servicePrice+'元邀请';
                }
                else{
                  data[i].inviteName = '已邀请'
                }
              }
              else{
                if (data[i].myInvite == 0) {
                  data[i].inviteName = '免费邀请';
                }
                else {
                  data[i].inviteName = '已邀请';
                }
              }
          }
          that.setData({
            teacherData: that.data.teacherData
          })
        })
      },function(){
        that.setData({
          isLoad: false,
        })
      });
  },
  setCurrent: function (e) {
    this.setData({
      current: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.index,
    })
  },
  current: function (e) {
    var that = this;
    this.setData({
      current: e.detail.current,
      type: e.detail.current,
      page:1,
      teacherData:[]
    },function(){
      that.getTotalTeacher();
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

  }
})