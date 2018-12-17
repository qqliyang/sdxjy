//index.js
//获取应用实例
var network = require("../../utils/request.js")
const app = getApp()

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 10000,
    duration: 1000,
    scrollData: [],
    selindex:0,
    scroll:false,
    selCity:false,
    cityName:'北京',
    page:1,
    pageSize:10,
    contentType:'',
    articleList:[],//文章
    isLoad:false,
    totalPage:'',
    noMore:false,
    bannerData:[],
    totalRow:null,
    msg:'暂无相关文章咨询',
    loadBox:true,
  },
  onLoad: function (options) {
     var that = this;
     that.getMessageList();
     app.getOpenId().then(function(){ 
          wx.getSetting({
            success: function (res) {
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: function (res) {
                      app.globalData.userInfo = res.userInfo;
                             
                      //文章分享
                      if (options.type == "share") {
                        let id = options.contentId;
                        wx.navigateTo({
                          url: '/pages/articleDetails/articleDetails?contentId=' + id,
                        })
                      }
                      //问答分享
                      if (options.type == "answer") {
                        let id = options.contentId;
                        wx.navigateTo({
                          url: '/pages/answerDetails/answerDetails?contentId=' + id,
                        })
                      }
                      //个人名片分享
                      if (options.type == "personPage") {
                        let id = options.teacherId;
                        wx.navigateTo({
                          url: '/pages/personPage/personPage?id=' + id,
                        })
                      }
                      //讲座分享
                      if (options.type == "shareJz") {
                        let id = options.contentId;
                        wx.navigateTo({
                          url: '/pages/jzDetails/jzDetails?id=' + id,
                        })
                      }
                      app.setProvince().then(
                      //同意位置授权
                      function () {
                        that.setData({
                          cityName: app.globalData.cityName == "" ? "北京市" : app.globalData.cityName
                        })
                        that.saveMineMess(app.globalData.userInfo, app.globalData.cityName);
                        that.getCityId(app.globalData.cityName)
                      },
                      //拒绝位置授权
                      function () {
                        that.setData({
                          cityName: app.globalData.cityName == "" ? "北京市" : app.globalData.cityName
                        })
                        that.saveMineMess(app.globalData.userInfo);
                        that.getCityId(app.globalData.cityName)
                      })

                  }
                })
              }
              else {
                wx.redirectTo({
                  url: '/pages/authority/authority',
                })
                return
              }
            }
          })     
     })
  },
  //获取消息列表
  getMessageList: function (userinfo, city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'message/getMessageList',
      {
        source:'c'
      }, '', function (res) {
        console.log(res)
      })
  },
  //formId埋点
  formSubmit:function(e){
      let formId = e.detail.formId
      app.sendFromId(formId);
  },
  //保存信息
  saveMineMess: function (userinfo,city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'member/updateCustomInfo',
      {
        customerId: app.globalData.customerId,
        locationName: city?city:'',
        wxPicurl: userinfo.avatarUrl,
        wxUname: userinfo.nickName,
      }, '', function (res) {
        
      })
  },
  //根据省份城市获取组织id
  getCityId: function (city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'org/getLocatedOrg',
      {
        locationName: city==''?'北京市':city,
      }, '', function (res) {
        app.globalData.orgId = res.data.orgId;
        that.getBanner();
        that.getArticleType();
      });
  },
  //获取banner
  getBanner: function (province, city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'banner/getBannerList',
      {
        come: '2',
        target: '1',
        orgId: app.globalData.orgId,
      }, '', function (res) {
        that.setData({
          bannerData:res.data
        })
      });
  },
  //获取当前城市对应文章类型
  getArticleType: function (province, city) {
      var that = this;
      network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentType',
     {
       appSource:'圣达信教育',
       appModule:'首页',
       orgId: app.globalData.orgId,//未设置默认北京组织id
     }, '', function (res) {
       let data = res.data.contentType;
       data = data.split(',');
       that.setData({
         scrollData:data,
         loadBox:false,
         contentType:data[0]
       },function(){
         that.getArticleTypeList();
       })
    });
  },
  //对应类型文章数据
  getArticleTypeList:function(){
      var that = this;
      that.setData({
        isLoad: true,
        noMore:false
      })
    network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentList',
      {
        orgId: app.globalData.orgId,
        page: that.data.page,
        pageSize: that.data.pageSize,
        contentType: that.data.contentType,
      }, '', function (res) {
        let data = res.data.list
        for (let i in data){
          data[i].contentType = (data[i].contentType.split(','))[0]
        }
        that.setData({
          articleList: that.data.articleList.concat(data),
          isLoad: false,
          totalRow: res.data.totalRow,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize)
        },function(){
          if (that.data.page == that.data.totalPage){
            that.setData({
              noMore:true
            })
          }
        })
      },function(){
        that.setData({
          isLoad: false
        })
      });
  },
  onReachBottom:function(){
      var that = this;
      //最后一页不请求
      if (that.data.totalPage == that.data.page){
          return
      }
      that.setData({
        page: that.data.page+1,
      },function(){
        that.getArticleTypeList();
      })
  },
  onPageScroll:function(e){
    if (e.scrollTop>=391){
      this.setData({
        scroll:true
      })
    }
    else{
      this.setData({
        scroll: false
      })
    }
  },
  //查询
  search:function(){
      wx.navigateTo({
        url: '/pages/search/search',
      })
  },
  //切换类型
  setSelIndex:function(e){
      var that = this;
      let index = e.currentTarget.dataset.index
      if (index == that.data.selindex){
        return
      }
      this.setData({
        selindex: index,
        page: 1,
        pageSize: that.data.pageSize,
        contentType: that.data.scrollData[index],
        articleList:[],
      },function(){
        that.getArticleTypeList();
      })
  },
  //升学问
  ask:function(){
      wx.navigateTo({
        url: '/pages/higherLearning/higherLearning',
      }) 
  },
  //老师zhen
  teacher:function(){
    wx.navigateTo({
      url: '/pages/teacherDiagnosis/teacherDiagnosis',
    }) 
  },
  //校长帮
  headmaster:function(){
      wx.navigateTo({
        url: '/pages/headmaster/headmaster',
      }) 
  },
  //选择城市
  setCity:function(){
      wx.navigateTo({
        url: '/pages/citySel/citySel',
      }) 
  },
  //查看详情
  seeDetails:function(e){
    let id =e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleDetails/articleDetails?contentId='+id,
    })
  },
  onShow: function () {
    var that = this;
    if (app.globalData.indexFresh){
      app.globalData.indexFresh=false;
      that.setData({
        cityName: app.globalData.cityName,
        articleList:[],
        page:1,
        bannerData:[],
        selindex:0,
      })
      that.getCityId(app.globalData.cityName);
    }
  },
  onPullDownRefresh:function(){
    var that = this;
    that.setData({
      articleList:[],
      selindex:0,
    },function(){
      that.getBanner();
      that.getArticleType();
      setTimeout(function(){
        wx.stopPullDownRefresh()
      },500)
    })
  },
})
