// pages/beingEvaluated/beingEvaluated.js
var network = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: [true, false, false, false, false],
    content:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id:options.id,
      })
  },
  setScore:function(e){
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.score;
    var that = this;
    that.data.score = [true, false, false, false, false]
    if(index == 0){
      that.data.score[index] = true;
    }
    if(index == 1){
      for(let x=0;x<=index;x++){
        that.data.score[x] = true;
      }
    }
    if (index == 2) {
      for (let x = 0; x <=index; x++) {
        that.data.score[x] = true;
      }
    }
    if (index == 3) {
      for (let x = 0; x <=index; x++) {
        that.data.score[x] = true;
      }
    }
    if (index == 4) {
      for (let x = 0; x <=index; x++) {
        that.data.score[x] = true;
      }
    }
    that.data.score[0]=true;
    that.setData({
      score: that.data.score
    })
  },
  setInputVal:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  commitPl:function(){
    let data = this.data.score;
    let score=0;
    for (let i in data){
        if(data[i]){
          score+=1;
        }
    }
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'meetRecord/update', 
    {
      meetId:that.data.id,
      fwscore: score,
      comment: that.data.content,
    }, '', function (res) {
      wx.showToast({
        title: '评价成功',
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