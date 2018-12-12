// component/searchHilightTextView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * {key:'关键字',name:'待匹配字符串'}
     */
    //搜索
    data: {
      type: Object,
      observer: function (newVal) {
        let searchArray = this.getHilightStrArray(newVal.contentTitle, newVal.key)
        this.setData({
          searchArray: searchArray,
          keyName: newVal.key
        })
      },
    },
    //老师诊职位
    datas: {
      type: Object,
      observer: function (newVal) {
        let searchArray = this.getHilightStrArray(newVal.job, newVal.key)
        this.setData({
        searchArray: searchArray,
        keyName: newVal.key
        })
      },
    },
    //老师诊名字
    datasName: {
      type: Object,
      observer: function (newVal) {
        let searchArray = this.getHilightStrArray(newVal.customerName, newVal.key)
        this.setData({
          searchArray: searchArray,
          keyName: newVal.key
        })
      },
    },
    //校长帮
    dataOrg: {
      type: Object,
      observer: function (newVal) {
        let searchArray = this.getHilightStrArray(newVal.orgName, newVal.key)
        this.setData({
          searchArray: searchArray,
          keyName: newVal.key
        })
      },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    searchArray:[],
    keyName:'',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getHilightStrArray: function(str, key) {
       return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
    }
  },
})