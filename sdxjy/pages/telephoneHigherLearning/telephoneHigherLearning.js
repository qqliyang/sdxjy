// pages/higherLearning/higherLearning.js
var uploadImg = require("../../utils/upload.js");
var network = require("../../utils/request.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data:'',
    maxFileCount: 9,
    pics: [],
    maxInputLen: 500,
    canInputLen: 500,
    textareaVal: '',
    tapTime: '',
    userData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let data = JSON.parse(options.data)
      this.setData({
        data:data
      })
      wx.setNavigationBarTitle({
        title: data.serviceTitle
      })
  },
  //输入的字数
  setTextarea: function (e) {
    if (this.data.canInputLen == 0) {
      this.setData({
        textareaVal: e.detail.value.substring(0, this.data.maxInputLen),
      })
      return
    }
    this.setData({
      textareaVal: e.detail.value,
      canInputLen: this.data.maxInputLen - e.detail.cursor
    })
  },
  //
  about:function(){
      wx.navigateTo({
        url: '/pages/aboutPhoneChat/aboutPhoneChat',
      })
  },
  //修改个人信息
  updateMess:function(){
      wx.navigateTo({
        url: '/pages/mineCard/mineCard?isChart=true',
      })
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    if (that.data.maxFileCount - pics.length == 0) {
      wx.showToast({
        title: '最多可上传' + that.data.maxFileCount + '张',
      })
      return
    }
    wx.chooseImage({
      count: that.data.maxFileCount - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        console.log(pics);
        that.setData({
          pics: pics,
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  //获取用户名片信息
  getUserMess:function(){
      var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: app.globalData.customerId,
      }, '', function (res) {
        that.setData({
          userData:res.data
        })
      });
  },
  //立即预约
  commitQuestion: function () {
    var that = this;
    var nowTime = new Date();
    if (nowTime - that.data.tapTime < 1000) {
      return;
    }
    if (that.data.textareaVal == "") {
      wx.showToast({
        title: '请输入描述内容',
        icon: 'none'
      })
      return
    }
    var formData = {
      meetType:1,
      meetStatus: 0,
      payStatus:0,
      wxpushStatus:0,
      studentQuestion: that.data.textareaVal,
      serviceId: that.data.data.serviceId, //服务id
      fromCustomerid:app.globalData.customerId, //
      toCustomerid: that.data.data.customerId, //预约谁的id
    }
    if (that.data.pics.length == 0) {
      that.commitContent(formData)
      return
    }
    //这一步就是调用方法
    uploadImg.uploadimg({
      url: app.globalData.requestUrl + 'meetRecord/save',//这里是你图片上传的接口
      path: that.data.pics,//这里是选取的图片的地址数组
      formData: formData,//其他的参数
    },true).then(function(res){
      that.taskPay(res);
    });
    that.setData({ 'tapTime': nowTime});
  },
  //没有图片上传
  commitContent: function (data) {
      var that = this;
      network.requestLoading('POST', app.globalData.requestUrl + 'meetRecord/save', data, '', function (res) {
      that.taskPay(res.data.meetId);
    });
  },
  //发起支付
  taskPay: function (id) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'meetRecord/payRequest',
      {
        payMethod: '3',
        orderId: id,
        openId: app.globalData.openId,
        appId: app.globalData.appId,
        returnUrl: '',
      }, '', function (res) {
        let data = res.data.orderResponseWx;
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'signType': data.signType,
          'paySign': data.paySign,
          'package': data.package,
          'success': function (res) {
            if (res.statusCode == 500) {
              wx.showToast({
                title: '服务器异常',
              })
              return;
            }
            wx.showToast({
              title: '预约成功',
            })
            that.notify(id, data.paySign);
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      })
  },
  //支付成功回调
  notify: function (id, sign) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'answerInvite/notify',
      {
        orderId: id,
        payFlag: 2,
        orderType: 5,
        sign: sign
      }, '', function (res) {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
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
     this.getUserMess();
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