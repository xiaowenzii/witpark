import {wxRequestPost, wxRequestGet} from "../../utils/util";

const app = getApp()
const codeKey = 1;
Page({
  data:{
    checkCodeImage:'',
    account:'',
    password:''
  },
  login (data) {
    var account = data.detail.value.account
    var password = data.detail.value.password;
    var checkCode = data.detail.value.checkCode;
    wx.switchTab({
      url: '../tab/home/home'
    })
    // if(account.length != 0 && password.length != 0 ){
    //   var parmas = { 
    //     "captcha": checkCode,
    //     "checkKey": codeKey,
    //     "password": password,
    //     "username": account
    //   };
    //   wxRequestPost("/sps/sys/login", "登入中...", parmas, 'application/json', function(res) {
    //     if(res.data.success){
    //       // 全局缓存Token
    //       wx.setStorageSync('token', res.data.result.token);
    //       wx.setStorageSync('userInfo', res.data.result.userInfo);
    //       wx.setStorageSync('account', account);
    //       wx.setStorageSync('password', password);
    //       wx.switchTab({
    //         url: '../tab/home/home'
    //       })
    //     }else{
    //       wx.showToast({
    //         icon: "none",
    //         title: (res.data.message)
    //       });
    //     }
    //   }, function(error) {})
    // } else {
    //   wx.showToast({
    //     title: '请输入账号密码！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    // }
  },
  //清空输入的账号
  claerAccount () {
    this.setData({
      account: ''
    });
  },
  getKeyCodeImage(){
    const that = this;
    wxRequestGet("/sps/sys/randomImage/"+codeKey, "获取验证码...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var baseImage = res.result.replace(/[\r\n]/g, '');
        that.setData({
          checkCodeImage: baseImage
        })
      }
    }, function(error) {})
  },
  reloadImage(){
    this.getKeyCodeImage();
  },
  onReady() {
    this.setData({
      account: wx.getStorageSync('account'),
      password: wx.getStorageSync('password')
    })
    this.getKeyCodeImage();
  }
})
