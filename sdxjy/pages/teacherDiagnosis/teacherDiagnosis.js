// pages/teacherDiagnosis/teacherDiagnosis.js
var network = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10,
    isFollow:'',
    totalPage:'',
    teacherData:[],
    isLoad: false,
    noMore: false,
    customerName:'',
    totalRow:null,
    msg:'换个条件试试',
    ceng:false,
    chatBox:false,
    serviceDetail:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getTeacherList();
  },
  setInput:function(e){
      this.setData({
        customerName:e.detail.value
      })
  },
  close: function () {
    this.setData({
      ceng: false,
      chatBox: false
    })
  },
  //到老师个人空间
  seePersonPage:function(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/personPage/personPage?id='+id,
      })
  },
  //开始预约
  startYy:function(e){
    this.getServicePrice(e.currentTarget.dataset.id);
  },
  //去购买
  buyService:function(e){
    let obj = JSON.stringify(e.currentTarget.dataset.obj);
    wx.navigateTo({
      url: '/pages/telephoneHigherLearning/telephoneHigherLearning?data='+obj,
    })
    this.setData({
      ceng: false,
      chatBox: false
    })
  },
  //获取预约服务价格详情
  getServicePrice:function(id){
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'meetPrice/list',
      {
        customerId:id,
      }, '', function (res) {
        that.setData({
          serviceDetail:res.data.list,
          ceng: true,
          chatBox: true,
        })
      });
  },
  startSearch:function(){
     var that = this;
     this.setData({
       teacherData:[],
       page:1,
     },function(){
       that.getTeacherList();
     })
  },
  getTeacherList:function(){
      var that = this;
      that.setData({
        isLoad: true,
        noMore: false
      })
      network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerList',
      {
        customerName: that.data.customerName,
        isTeacher:1,
        sourceId:app.globalData.customerId,
        page:that.data.page,
        pageSize:that.data.pageSize
      }, '', function (res) {
        let data = res.data.list;
        //把搜索内容传到数据里 高亮作为key需要
        for (let i in data) {
          data[i].key = that.data.customerName;
        }
        that.setData({
           teacherData: that.data.teacherData.concat(data),
           isLoad:false,
           totalRow: res.data.totalRow,
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
          isLoad:false,
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
    console.log('index',index)
    //取消关注
    if (e.currentTarget.dataset.isfollow == "true") {
      this.cancleFollowClick(e.currentTarget.dataset.id,index);
    }
    //点击关注
    else {
      this.FollowClick(e.currentTarget.dataset.id,index);
    }
    this.setData({ 'tapTime': nowTime });
  },
  //点击关注
  FollowClick: function (id,inx) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/addCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a1',
        targetId: id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        that.data.teacherData[inx].myFollow='true';
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
  cancleFollowClick: function (id,inx) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'behavior/removeCustomerBehavior',
      {
        behaviorType: 'a',
        behaviorEvent: 'a1',
        targetId:id,
        sourceId: app.globalData.customerId
      }, '', function (res) {
        
        that.data.teacherData[inx].myFollow = 'false';
        that.data.teacherData[inx].followCount-=1
        that.setData({
          teacherData: that.data.teacherData,
        })
        wx.showToast({
          title: '已取消关注',
          icon: 'none'
        })
      });
  },
  totaggle:function(e){
    let index = e.currentTarget.dataset.index;
    var that = this;
    that.data.teacherData[index].totaggle=true;
    that.setData({
      teacherData: that.data.teacherData
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
        that.getTeacherList();
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})