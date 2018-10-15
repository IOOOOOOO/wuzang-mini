Component({
  properties: {
    // 这里定义属性，属性值可以在组件使用时指定
    opt:{
      type:Object,
      value:{
        title:"none",//标题
        back: true,//是否显示返回
        color: "#000000",//导航栏字体色
        background:"#fff",//导航栏背景色
        fontSize:"38rpx",//字体大小
        fixed: true, //导航栏是否fixed定位
        background_show:true,//是否显示填充
      },
      observer: function (newVal, oldVal, changedPath) {
        //未设置
        if (!newVal) {
          let obj = {};
          obj[changedPath[0]] = oldVal;
          this.setData(obj);
        }
        else{
          // 无赋值则使用默认
          for (var s in oldVal) {
            if (newVal[s]==undefined){
              newVal[s] = oldVal[s];
            }

          }
          this.setData({ "opt": newVal });
        }
      }
    },
  },
  data: {
    // 这里是一些组件内部数据
    height: 44,//导航栏高度,
    paddingTop: 20,//导航栏上内边距对应状态栏高度
    showHomeButton: false,//是否显示返回首页
    show: true,//是否显示导航栏
  },
  attached: function(option){
    //检测首页是否在当前页面栈中
    let pages = getCurrentPages();
    let showHomeButton = false;
    if(pages.length < 2 && pages[0].route != __wxConfig.pages[0]){
      showHomeButton = true;
    }
    //导航栏自适应
    let systemInfo = wx.getSystemInfoSync();
    let reg = /ios/i;
    let pt = 20;//导航状态栏上内边距
    let h = 44;//导航状态栏高度
    if(reg.test(systemInfo.system)){
        pt = systemInfo.statusBarHeight;
        h = 44;
    }else{
        pt = systemInfo.statusBarHeight;
        h = 48;
    }
    this.setData({
      height: h,
      paddingTop: pt,
      showHomeButton: showHomeButton
    });
  },
  methods: {
    // 这里是一个自定义方法
    navigateBack(){
      let pages = getCurrentPages();
      if(pages.length < 2 && pages[0].route != __wxConfig.pages[0]){
        wx.reLaunch({url:'/'+__wxConfig.pages[0]})
      }else{
        wx.navigateBack({delta:1});
      }
    },
    navigateBackHome(){
      wx.reLaunch({url:'/'+__wxConfig.pages[0]})
    },
    /**
     * 切换导航栏显示
      */
    toggleShow(){
      !this.data.show && this.setData({show: true});
    },
    /**
     * 切换导航栏隐藏
      */
    toggleHide() {
      this.data.show && this.setData({ show: false });
    }
  }
})