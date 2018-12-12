// pages/jzDetails/jzDetails.js
var network = require("../../utils/request.js")
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',
      loadBox:true,
      jzData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let id = options.id;
      this.setData({
        id:id,
      })
      this.getJzDetails(id);
  },
  //讲座详情
  getJzDetails: function (id) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'lecture/getLectureById',
      {
        lectureId:id,
        sourceId: app.globalData.customerId,
      }, '', function (res) {
        let data =res.data;
        data.lectureImgs = data.lectureImgs.split('@');
        console.log(data)
        that.setData({
            jzData:data,
            loadBox:false
        })
        WxParse.wxParse('articles', 'html', res.data.lectureContent, that, 5);
      }, function () {
        that.setData({
          loadBox: false,
        })
      });
  },
  //讲座立即报名
  startEnroll: function (e) {
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if (status == 1) {
      wx.showToast({
        title: '已经报名了',
        icon: "none"
      })
      return
    }
    this.getUserMess(id, index);
  },
  //获取用户个人信息
  getUserMess: function (id, index) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: app.globalData.customerId,
      }, '', function (res) {
        if (!(res.data.phone)) {
          wx.showModal({
            title: '提示',
            content: '您当前暂无实名信息，保存后可以报名！',
            success: function () {
              wx.navigateTo({
                url: '/pages/mineCard/mineCard?jz=true',
              })
            }
          })
        }
        else {
          that.enscroll(id, index);
        }
      });
  },
  //立即报名
  enscroll: function (id, index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'lecture/addLectureOrder',
      {
        customerId: app.globalData.customerId,
        lectureId: id
      }, '', function (res) {
        wx.showToast({
          title: '报名成功',
        })
        that.data.jzData.myOrder = 1;
        that.setData({
          jzData: that.data.jzData
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
        title: this.data.article.contentTitle,
        path: '/pages/index/index?type=shareJz' + "&contentId=" + this.data.id,
        success: (res) => {
          wx.showToast({
            title: '转发成功',
            icon:'none'
          })
        },
        fail: (res) => {
          console.log("转发失败", res);
        }
      }
    }
})