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
  newsong: '/personalized/newsong', //推荐新音乐
  banner: '/banner', //导航 
  resource: '/recommend/resource', //推荐歌单
  songs: '/recommend/songs', //推荐音乐
  topSongs: '/top/song', //新歌速递 
  album: '/album', //新碟上架
  artists: '/top/artists', //热门歌手
  topList: '/top/list', //排行榜
  artist: '/toplist/artist', //歌手排行榜 
  toplist: '/toplist', //所有榜单

}
export default REQUEST;