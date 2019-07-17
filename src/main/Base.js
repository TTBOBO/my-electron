import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
  screen
} from 'electron'
const path = require('path')
const fs = require('fs')
class Base {
  constructor({
    baseUrl,
    musicUrl
  }) {
    this.baseUrl = baseUrl
    this.musicUrl = musicUrl
    this.mainWindow = null
    this.lyricWindow = null
    this.beowserWindows = {}
    this.downloadItems = {}
    this.tray = null
    this.settingConfig = {}
    this.thumbarBtns = []
  }

  initApp(loadSuccess) {
    this.loadSuccess = loadSuccess
    app.on('ready', this.createWindow.bind(this))
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  createWindow() {
    this.createBrowserWindow({
      minWidth: 1200,
      height: 563,
      useContentSize: true,
      width: 1200,
      darkTheme: true,
      frame: false,
      isMain: true,
      winURL: this.baseUrl,
      finishLoad: () => {
        this.creatLyricWindow() //创建歌词窗口
        this.loadSuccess()
        this.initIpc()
        this.initTray()
        this.initSearchMusic()
        this.resgisterCode()
        this.setThumbarBtns()
      }
    })
  }

  creatLyricWindow() {
    const {
      width,
      height
    } = screen.getPrimaryDisplay().workAreaSize
    console.log(0)
    this.lyricWindow = this.createBrowserWindow({
      // maxWidth: 800,
      // minWidth: 800,
      // // maxHeight: 150,
      // minHeight: 150,
      width: 800,
      height: 500,
      y: height - 650,
      x: (width - 500) / 2,
      useContentSize: true,
      darkTheme: true,
      resizable: true,
      frame: false,
      isMain: true,
      winURL: this.musicUrl,
      show: false,
      closable: false,
      // skipTaskbar: true,
      alwaysOnTop: false,
      transparent: true,
      bgColor: "#00FFFFFF",
      isMain: false,
      finishLoad: () => {
        console.log('创建成功')
      }
    })

  }

  resgisterCode() {
    globalShortcut.register('Alt+P', () => {
      this.mainWindow.send('playPrev')
    })
    globalShortcut.register('Alt+N', () => {
      this.mainWindow.send('playNext')
    })
    globalShortcut.register('Alt+S', () => {
      this.mainWindow.send('togglePlay')
    })
  }

  setThumbarBtns() {
    this.thumbarBtns = [{
        tooltip: '上一首',
        icon: this.getNativeImg('/img/prev.png'),
        click: () => {
          this.mainWindow.send('playPrev')
        }
      },
      {
        tooltip: '播放',
        icon: this.getNativeImg('/img/play.png'),
        click: () => {
          this.mainWindow.send('togglePlay')
        }
      },
      {
        tooltip: '下一首',
        icon: this.getNativeImg('/img/next.png'),
        click: () => {
          this.mainWindow.send('playNext')
        }
      }
    ]
    this.mainWindow.setThumbarButtons(this.thumbarBtns)
  }

  initIpc() {
    ipcMain.on('settingConf', (e, conf) => {
      this.settingConfig = conf
      this.initDownload()
    })
    ipcMain.on('miniSize', () => {
      console.log(2222)
      this.mainWindow.minimize()
    })
    ipcMain.on('maxSize', () => {
      console.log(1111)
      this.mainWindow[
        this.mainWindow.isMaximized() ? 'unmaximize' : 'maximize'
      ]()
    })
    ipcMain.on('close', () => this.mainWindow.minimize())
    ipcMain.on('download', (e, data, status) => {
      let downloadItem = this.downloadItems[Math.round(data)]
      if (!downloadItem) return
      switch (status) {
        case 'pause':
          downloadItem.pause()
          break
        case 'cancel':
          downloadItem.cancel()
          break
        case 'resume':
          if (downloadItem.canResume()) {
            downloadItem.resume()
          }
          break
        default:
          break
      }
    })
    ipcMain.on('playStatus', (e, status) => {
      this.thumbarBtns[1].icon = this.getNativeImg(
        status ? '/img/stop.png' : '/img/play.png'
      )
      this.thumbarBtns[1].tooltip = status ? '暂停' : '播放'
      this.mainWindow.setThumbarButtons(this.thumbarBtns)
    })
    ipcMain.on('showLyric', (e, status) => {
      this.lyricWindow[status ? 'show' : 'hide']()
      console.log();
    })
    ipcMain.on('drag', (e, {
      x,
      y
    }) => {
      const [x1, y1] = this.lyricWindow.getPosition();
      console.log(`x1：${x1},x：${x}  ====   ${x1+x}`)
      console.log(`y1：${y1},y：${y}  ====   ${y1+y}`)
      this.lyricWindow.setPosition(x1 + x, y1 + y)
    })
  }

  getNativeImg(pathUrl) {
    return nativeImage.createFromPath(path.join(__static, pathUrl))
  }

  initDownload() {
    this.mainWindow.webContents.session.removeAllListeners('will-download')
    this.mainWindow.webContents.session.on(
      'will-download',
      this.doDownLoad.bind(this)
    )
  }

  doDownLoad(event, item, webContents) {
    const {
      downloadDir
    } = this.settingConfig
    let name = item.getFilename()
    let path = downloadDir + '\\' + name
    item.path = path
    item.fileName = name
    item.taskId = Math.round(item.getStartTime())
    item.setSavePath(path)
    this.downloadItems[Math.round(item.getStartTime())] = item
    item.on('updated', (event, state) => {
      // console.log(item.music_id)
      let file = this.FileObject(item, item.isPaused() ? 'interrupted' : false)
      webContents && webContents.send('download', file)
    })
    item.on('done', (event, state) => {
      let file = this.FileObject(item, item.isPaused() ? 'interrupted' : false)
      webContents && webContents.send('download', file)
      if (state === 'completed') {
        console.log('下载完成')
        delete this.downloadItems[Math.round(item.getStartTime())]
      } else if (state === 'cancelled') {
        console.log('下载取消')
      }
    })
  }

  initSearchMusic() {
    let count = 0
    ipcMain.on('scnn', (event, arg) => {
      let musicArr = []
      arg.forEach((dir, _index) => {
        let data = fs.readdirSync(dir)
        data.forEach(async item => {
          if (/\.mp3$/.test(item)) {
            let data = fs.readFileSync(dir + '\\' + item)
            musicArr.push({
              type: 'mp3',
              path: data,
              length: data.length,
              dir: dir + '\\' + item,
              name: item.replace('.mp3', '')
            })
          }
        })
      })
      event.sender.send('playMusic', musicArr)
    })

    ipcMain.on('get_local_music', (event, dir) => {
      console.log(count++)
      let buffer = fs.readFileSync(dir)
      event.sender.send('local_music_cbk', buffer)
    })
  }

  initTray() {
    let defaultIcon = path.join(__static, '/img/icon.ico')
    let changeIcon = path.join(__static, '/img/prev.png')

    this.tray = new Tray(defaultIcon)
    let menuItems = [{
        label: '上一首',
        icon: this.getNativeImg('/img/prev.png'),
        click: () => {
          this.mainWindow.send('playPrev')
        }
      },
      {
        label: '播放/暂停',
        icon: this.getNativeImg('/img/stop.png'),
        click: () => {
          this.mainWindow.send('togglePlay')
        }
      },
      {
        label: '下一首',
        icon: this.getNativeImg('/img/next.png'),
        click: () => {
          this.mainWindow.send('playNext')
        }
      },
      {
        label: '退出',
        icon: this.getNativeImg('/img/close.png'),
        click: () => {
          app.quit()
        }
      }
      // {
      //   label: "图标闪烁",
      //   click: () => {
      //     let count = 0;
      //     let timer = setInterval(() => {
      //       count++;
      //       this.tray.setImage(count % 2 ? defaultIcon : changeIcon);
      //       if (count > 10) {
      //         clearInterval(timer);
      //       }
      //     }, 500)
      //   }
      // }
    ]
    this.tray.setToolTip('This is my application.')
    this.tray.setContextMenu(Menu.buildFromTemplate(menuItems))
    this.tray.on('click', () => {
      this.mainWindow.restore()
    })
  }

  FileObject(item, state) {
    return {
      music_id: new Date().getTime(),
      url: item.getURLChain(),
      time: item.getStartTime(),
      music_name: item.fileName,
      path: item.path,
      chunk: item.getReceivedBytes(),
      size: item.getTotalBytes(),
      trans_type: 'download',
      state: state || item.getState(),
      disk_main: item.getURL(),
      canResume: item.canResume(),
      shows: true,
      taskId: item.taskId
    }
  }

  createBrowserWindow({
    width,
    height,
    x,
    y,
    useContentSize,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    resizable,
    alwaysOnTop,
    parent,
    bgColor,
    winURL,
    isMain,
    finishLoad,
    windowName,
    modal,
    show,
    frame,
    transparent,
    skipTaskbar
  }) {
    let newWindow = new BrowserWindow({
      backgroundColor: bgColor,
      x,
      y,
      maxWidth,
      maxHeight,
      alwaysOnTop,
      skipTaskbar,
      parent,
      modal,
      show,
      resizable,
      transparent: true,
      frame: frame || false,
      width: width || 1200,
      minWidth: minWidth || 1200,
      height: height || 563,
      minHeight: minHeight || 563,
      useContentSize: useContentSize || true,
      // autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: process.env.NODE_ENV === 'development' ? false : true
      }
    })
    newWindow.loadURL(winURL || this.baseUrl)
    newWindow.on('closed', () => {
      newWindow = null
    })

    newWindow.on('miniSize', () => {
      newWindow.minimize()
    })

    newWindow.webContents.on('did-finish-load', () => {
      finishLoad && typeof finishLoad === 'function' && finishLoad()
    })
    isMain && (this.mainWindow = newWindow)
    this.beowserWindows[windowName || 'mainWindow'] = newWindow
    return newWindow
  }
}

export default Base