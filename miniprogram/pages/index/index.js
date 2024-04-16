const app = getApp()
Page({
  login (data) {
    // var account = data.detail.value.account
    // var password = data.detail.value.password;
    // if(account.length != 0 && password.length != 0 ){
    wx.navigateTo({
      url: '../tab/home/home'
    })
    // } else {
    //   wx.showToast({
    //     title: '请输入账号密码！',
    //     icon: 'none',
    //     duration: 1500
    //  })
    // }
  },
  //清空输入的账号
  claerAccount () {
    this.setData({
      account: ''
    });
  }
})
