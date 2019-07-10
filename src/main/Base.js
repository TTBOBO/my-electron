import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage
} from 'electron'
const path = require('path');
class Base {
  constructor({
    baseUrl
  }) {
    this.baseUrl = baseUrl;
    this.mainWindow = null;
    this.beowserWindows = {};
    this.downloadItems = {};
    this.tray = null;
    this.settingConfig = {};
  }

  initApp(loadSuccess) {
    this.loadSuccess = loadSuccess;
    app.on('ready', this.createWindow.bind(this));
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
        this.loadSuccess();
        this.initIpc();
        this.initTray();
        this.initSearchMusic();
      }
    })
  }

  initIpc() {
    ipcMain.on('settingConf', (e, conf) => {
      this.settingConfig = conf;
      this.initDownload();
    })
    ipcMain.on('miniSize', () => this.mainWindow.minimize())
    ipcMain.on('maxSize', () => {
      this.mainWindow[this.mainWindow.isMaximized() ? 'unmaximize' : 'maximize']()
    })
    ipcMain.on('close', () => this.mainWindow.minimize());
    ipcMain.on('download', (e, data, status) => {
      let downloadItem = this.downloadItems[Math.round(data)];
      if (!downloadItem) return;
      switch (status) {
        case 'pause':
          downloadItem.pause();
          break;
        case 'cancel':
          downloadItem.cancel();
          break;
        case 'resume':
          if (downloadItem.canResume()) {
            downloadItem.resume();
          }
          break;
        default:
          break;
      }
    })
  }

  initDownload() {
    this.mainWindow.webContents.session.removeAllListeners('will-download');
    this.mainWindow.webContents.session.on('will-download', this.doDownLoad.bind(this))
  }

  doDownLoad(event, item, webContents) {
    const {
      downloadDir
    } = this.settingConfig;
    let name = item.getFilename();
    item.setSavePath(downloadDir + '\\' + name);

    // console.log(downloadDir + '\\' + name)
    this.downloadItems[Math.round(item.getStartTime())] = item;
    webContents && webContents.send('download', item.getStartTime())
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('download is intertupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log("download is paused");
        } else {
          console.log("当前下载文件大小:" + (Math.round(item.getReceivedBytes() / 1000)) + 'kb/s');
        }
      }
    })
    item.on('done', (event, state) => {
      console.log(state)
      if (state === 'completed') {
        console.log("下载完成");
        delete this.downloadItems[Math.round(item.getStartTime())];
      } else if (state === 'cancelled') {
        console.log("下载取消");
      }
    })
  }

  initSearchMusic() {
    ipcMain.on('scnn', (event, arg) => {
      let musicArr = [];
      arg.forEach((dir, _index) => {
        let data = fs.readdirSync(dir)
        data.forEach(async (item) => {
          if (/\.mp3$/.test(item)) {
            let data = fs.readFileSync(dir + '\\' + item);
            musicArr.push({
              type: 'mp3',
              path: data,
              length: data.length,
              dir,
              name: item.replace('.mp3', '')
            });
          }
        });
      })
      event.sender.send('playMusic', musicArr)
    })
  }

  initTray() {
    let defaultIcon = path.join(__static, '/img/icon.ico');
    let changeIcon = path.join(__static, '/img/prev.png')

    this.tray = new Tray(defaultIcon);
    let menuItems = [{
        label: '上一首',
        icon: nativeImage.createFromPath(path.join(__static, '/img/prev.png')),
        click: () => {
          this.mainWindow.send('playPrev');
        }
      },
      {
        label: '播放/暂停',
        icon: nativeImage.createFromPath(path.join(__static, '/img/stop.png')),
        click: () => {
          // menuItems[1].icon = nativeImage.createFromPath(path.join(__static, '/img/play.png'));
          // this.tray.setContextMenu(Menu.buildFromTemplate(menuItems));
          this.mainWindow.send('togglePlay');
        }
      }, {
        label: '下一首',
        icon: nativeImage.createFromPath(path.join(__static, '/img/next.png')),
        click: () => {
          this.mainWindow.send('playNext');
        }
      },
      {
        label: '退出',
        icon: nativeImage.createFromPath(path.join(__static, '/img/close.png')),
        click: () => {
          app.quit();
        }
      },
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
    ];
    this.tray.setToolTip('This is my application.')
    this.tray.setContextMenu(Menu.buildFromTemplate(menuItems));
    // setTimeout(() => {
    //   console.log(111)
    //   menuItems[1].icon = nativeImage.createFromPath(path.join(__static, '/img/play.png'));
    //   this.tray.setContextMenu(Menu.buildFromTemplate(menuItems));
    // }, 10000)
    this.tray.on('click', () => {
      this.mainWindow.restore();
    })
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
    windowName
  }) {
    let newWindow = new BrowserWindow({
      backgroundColor: bgColor,
      x,
      y,
      maxWidth,
      maxHeight,
      alwaysOnTop,
      parent,
      frame: false,
      width: width || 1200,
      minWidth: minWidth || 1200,
      height: height || 563,
      minHeight: minHeight || 563,
      useContentSize: useContentSize || true,
      resizable: resizable || true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: (process.env.NODE_ENV === 'development') ? false : true
      }
    })
    newWindow.loadURL(winURL || this.baseUrl);
    newWindow.on('closed', () => {
      newWindow = null
    })

    newWindow.on('miniSize', () => {
      newWindow.minimize()
    })

    newWindow.webContents.on('did-finish-load', () => {
      (finishLoad && typeof finishLoad === 'function') && finishLoad();
    })
    isMain && (this.mainWindow = newWindow);
    this.beowserWindows[windowName || 'mainWindow'] = newWindow;
    return newWindow;
  }
}

export default Base;