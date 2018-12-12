// pages/headmaster/headmaster.js
var network = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/image/address.png',
      '/image/banner.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 10000,
    duration: 1000,
    orgName:'',
    page:1,
    pageSize:10,
    orgList:[],
    loadBox:true,
    totalPage:'',
    totalRow:null,
    msg:'换个条件试试',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeadMasterList();
  },
  getHeadMasterList:function(){
    var that = this;
    that.setData({
      isLoad: true,
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'org/getOrgList',
      {
        orgName:that.data.orgName,
        page: that.data.page,
        pageSize: that.data.pageSize,
      }, '', function (res) {
        that.setData({
          orgList: that.data.orgList.concat(res.data.list),
          loadBox: false,
          isLoad: false,
          totalRow: res.data.totalRow,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize)
        },function(){
          
          let data = that.data.orgList;
          let topData = [];
          let nextData = [];
          for (let i in data) {        
            if (data[i].orgName.indexOf('北京') != -1) {           
              data[i].isZb = true
              data[i].orgImgs = typeof (data[i].orgImgs) == "object" ? data[i].orgImgs:(data[i].orgImgs).split('@');
              data[i].key = that.data.orgName;
              topData.push(data[i])
            }
            else {         
              data[i].isZb = false
              data[i].orgImgs = typeof (data[i].orgImgs) == "object" ? data[i].orgImgs : (data[i].orgImgs).split('@');
              data[i].key = that.data.orgName;
              nextData.push(data[i])
            }
          }
          that.setData({
            orgList: that.data.orgList,
            topData: topData,
            nextData: nextData,
            isLoad: false,
          })
        })
      },function(){
        that.setData({
          isLoad: false,
        })
      });
  },
  //搜索
  setName:function(e){
    var that = this;
    this.setData({
      orgName:e.detail.value,
    })
  },
  //搜索
  search:function(){
      var that = this;
      that.setData({
        page: 1,
        orgList: []
      }, function () {
        that.getHeadMasterList();
      })
  },
  //打电话
  phone:function(e){
      console.log(e)
      let phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
  },
  seeDetails:function(e){
      let obj = (JSON.stringify(e.currentTarget.dataset.obj))
      wx.navigateTo({
        url: '/pages/headmasterDetails/headmasterDetails?data='+obj,
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
      that.getHeadMasterList();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})