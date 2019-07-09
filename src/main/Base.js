import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} from 'electron'
class Base {
  constructor({
    baseUrl
  }) {
    this.baseUrl = baseUrl;
    this.mainWindow = null;
    this.beowserWindows = {};
    this.downloadItems = {};
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
        this.initTray();
        this.initSearchMusic();
        this.initDownload();
        this.initIpc();
      }
    })
  }

  initIpc() {
    ipcMain.on('miniSize', () => this.mainWindow.minimize())
    ipcMain.on('maxSize', () => {
      this.mainWindow[this.mainWindow.isMaximized() ? 'unmaximize' : 'maximize']()
    })
    ipcMain.on('close', () => this.mainWindow.minimize());
    ipcMain.on('download', (e, data, status) => {
      console.log("参数：" + data)
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
    this.mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
      let name = item.getFilename();
      item.setSavePath('C:\\Users\\Administrator\\Desktop\\测试文件\\' + name);
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
        if (state === 'completed') {
          console.log("下载完成");
          delete this.downloadItems[Math.round(item.getStartTime())];
        } else if (state === 'cancelled') {
          console.log("下载取消");
        }
      })
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
    const tray = new Tray(
      '/Users/Administrator/Desktop/electron/my-electron/build/icons/256x256.png'
    )
    const contextMenu = Menu.buildFromTemplate([{
        label: '上一首',
        click() {
          this.mainWindow.send('playPrev')
        }
      },
      {
        label: '播放/暂停',
        click() {
          this.mainWindow.send('togglePlay')
        }
      }, {
        label: '下一首',
        click() {
          this.mainWindow.send('playNext')
        }
      }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
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