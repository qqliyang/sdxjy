// pages/mineNotice/mineNotice.js
var network = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      page:1,
      pageSize:10,
      noticeList:[],
      totalRow: null,
      msg: '暂无相关内容',
      loadBox: false,
      current:0,
      type:'teacher',////[teacher-关注的老师,question-关注的问题] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getNoticeList();
  },
  //对应类型文章数据
  getNoticeList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'member/getFollowListByCustomId',
      {
        customerId: app.globalData.customerId,
        followType: that.data.type,
        page: that.data.page,
        pageSize: that.data.pageSize,
      }, '', function (res) {
        let data = res.data.list
        for (let i in data){
          data[i].file = data[i].file ? (data[i].file.substring(0, data[i].file.length - 1)).split('@'):[];
          data[i].myFollow = 'true';
        }
        that.setData({
          noticeList: that.data.noticeList.concat(data),
          isLoad: false,
          totalRow: res.data.totalRow,
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
      });
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
      type: e.detail.current == 0 ? "teacher" :"question",
      page:1,
      noticeList:[],
    },function(){
      that.getNoticeList();
    })
  },
  //详情
  seeDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/answerDetails/answerDetails?contentId=' + id,
    })
  },
  //到老师个人空间
  seePersonPage: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personPage/personPage?id=' + id,
    })
  },

  Follow: function (e) {
    //禁止连续点击
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    let index = e.currentTarget.dataset.index;
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
        that.data.noticeList[inx].myFollow = 'true';
        that.setData({
          noticeList: that.data.noticeList,
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
    console.log(999,id,inx)
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a1',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {

        that.data.noticeList[inx].myFollow = 'false';
        that.setData({
          noticeList: that.data.noticeList,
        })
        wx.showToast({
          title: '已取消关注',
          icon: 'none'
        })
      });
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
      that.getArticleTypeList();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})