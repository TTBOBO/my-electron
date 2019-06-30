const REQUEST = {
  login: "/login/cellphone", //登录
  refreshStatus: "/login/refresh", //刷新登录状态
  sendCode: "/captch/sent", //发送验证码
  loginOut: "/logout", //退出登录
  loginOut: "/logout", //退出登录 
  userDetail: "/user/detail", //用户信息 
  signin: "/daily_signin", // 签到 
  subcount: "/user/subcount", //获取用户信息 , 歌单，收藏，mv, dj 数量
  playlist: '/user/playlist', //用户歌单
  playlistDetail: "/playlist/detail", //歌单详情
  lyric: '/lyric', //歌词
  newsong:'/personalized/newsong', //推荐新音乐
}
export default REQUEST;