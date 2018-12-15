// pages/higherLearning/higherLearning.js
var uploadImg = require("../../utils/upload.js");
var network = require("../../utils/request.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxFileCount:9,
    pics:[],
    maxInputLen:500,
    canInputLen:500,
    textareaVal:'',
    tapTime:'',
    isCheck: false,
  },
   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  change: function (e) {
    this.setData({
      isCheck: e.detail.value
    })
  },
  //输入的字数
  setTextarea:function(e){
      if (this.data.canInputLen == 0){
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

  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    if (that.data.maxFileCount - pics.length == 0){
      wx.showToast({
        title: '最多可上传' + that.data.maxFileCount+'张',
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
  //提交评价
  commitQuestion: function() {
    var that = this;
    var nowTime = new Date();
    if (nowTime - that.data.tapTime < 1000) {
      return;
    }
    if (that.data.textareaVal == ""){
      wx.showToast({
        title: '请输入描述内容',
        icon:'none'
      })
      return
    }
    var formData = {
      title: '',
      customerId: app.globalData.customerId,
      describe: that.data.textareaVal,
      isOpen: that.data.isCheck?1:0,
      isTop: 0
    }
    if(that.data.pics.length == 0){
      that.commitContent(formData)
      return
    }  
    //这一步就是调用方法
    uploadImg.uploadimg({
        url: app.globalData.requestUrl +'question/addQuestion',//这里是你图片上传的接口
        path: that.data.pics,//这里是选取的图片的地址数组
        formData: formData,//其他的参数
    });
    that.setData({ 'tapTime': nowTime,});
   },
   
   //没有图片上传
  commitContent: function (data) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'question/addQuestion', data, '', function (res) {
      wx.showToast({
        title: '提交成功',
        duration: 3000
      });
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