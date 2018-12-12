// pages/citySel/citySel.js
var network = require("../../utils/request.js")
const app = getApp();
var b='';
function unique(list) {
  var arr = [];
  for (var i = 0; i < list.length; i++) {
    if (i == 0) arr.push(list[i]);
    b = false;
    if (arr.length > 0 && i > 0) {
      for (var j = 0; j < arr.length; j++) {
        if (arr[j].provName == list[i].provName) {
          b = true;
          //break;
        }
      }
      if (!b) {
        arr.push(list[i]);
      }
    }
  }
  return arr;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    hotCity: {'key':'热门城市',
      'item':[
        { 'cityName': '北京市', 'cityKey': '热门城市'},
        { 'cityName': '天津市', 'cityKey': '热门城市' },
        { 'cityName': '南京市', 'cityKey': '热门城市'}, 
        { 'cityName': '长沙市', 'cityKey': '热门城市' }, 
        { 'cityName': '南昌市', 'cityKey': '热门城市' }, 
        { 'cityName': '西安市', 'cityKey': '热门城市' }, 
        { 'cityName': '广州市', 'cityKey': '热门城市' }, 
        { 'cityName': '太原市', 'cityKey': '热门城市' },
        { 'cityName': '云南市', 'cityKey': '热门城市' }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCity();
  },
  //获取省份
  getCity: function (province, city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'org/getCityList',
      {
        cityName:''
      }, '城市加载中...', function (res) {
        let data = res.data;
        let totalCity=[]
        for (var i = 0; i < 26; i++) {
          let zm = String.fromCharCode((65 + i));//英文字母
          totalCity.push({ "key": zm })
          totalCity[i].item = [];
          for(var x in data){
            if (data[x].cityKey == zm){
               (totalCity[i].item).push({ 'cityName': data[x].cityName, 'cityKey': data[x].cityKey})
            }
          }
        }
        // let city=[];
        // //循环取出所有省
        // for(let i in data){
        //   city.push({ 'provName': data[i].provName, 'provKey': data[i].provKey, 'provId': data[i].provId})
        // }
        //var totalCity = unique(city);
        // for (let x in totalCity){
        //     totalCity[x].item = [];  
        //     for(let y in data){
        //       if (totalCity[x].provName == data[y].provName){
        //         (totalCity[x].item).push(
        //           { 
        //             'cityName': data[y].cityName, 
        //             'cityKey': data[y].cityKey,
        //             'cityId': data[y].cityId, 
        //             'provName': totalCity[x].provName, 
        //             'provKey': totalCity[x].provKey, 
                     
        //           })//
        //        }
        //     }
        // }
        totalCity.unshift(that.data.hotCity);
        that.setData({
          city: totalCity
        })
      });
  },
  //选择的城市
  bindtap:function (e) {
    var that = this;
    console.log(e)
    let cityName = e.detail.cityName;
    app.globalData.cityName = cityName;
    app.globalData.indexFresh = true;
    this.saveMineMess(cityName);
  },
  saveMineMess: function (city){
      var that = this;
      network.requestLoading('GET', app.globalData.requestUrl + 'member/updateCustomInfo',
      {
        customerId: app.globalData.customerId,
        locationName: city,
      }, '', function (res) {
        wx.showToast({
          title: '保存地址成功',
        })
        setTimeout(function(){
          wx.navigateBack({});
        },1000)
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