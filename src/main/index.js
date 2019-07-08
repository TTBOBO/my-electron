import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  session
} from 'electron'
import fs from 'fs';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`
let downloadItems = {};

function createWindow() {
  /**
   * Initial window options
   */
  // new tray('../renderer/assets/logo.png').on('right-click', () => {
  //   console.log(112313)
  // })
  // tray.on('right-click', () => {
  //   console.log(111)
  // })
  // console.log()
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    height: 563,
    useContentSize: true,
    width: 1200,
    darkTheme: true,
    frame: false,
    // titleBarStyle: 'hidden'
  })
  // mainWindow.callback = () => {

  //   session.removeAllListeners('will-download');
  //   session.on('will-download', (event, item, webContents) => {
  //     let name = item.getFilename();
  //     console.log(name);
  //     item.setSavePath('C:/Users/Administrator/Desktop/测试文件/' + name);
  //     item.on('updated', (event, state) => {
  //       console.log(state);
  //       if (state === 'interrupted') {
  //         console.log('download is intertupted but can be resumed')
  //       } else if (state === 'progressing') {
  //         if (item.isPaused()) {
  //           console.log("download is paused");
  //         } else {
  //           console.log(item.getReceivedBytes());
  //         }
  //       }
  //     })
  //     item.on('done', (event, state) => {
  //       if (state === 'completed ') {
  //         console.log("下载完成");
  //       } else if (state === 'cancelled') {
  //         console.log("下载取消");
  //       }
  //     })
  //   })
  // }

  const tray = new Tray(
    '/Users/Administrator/Desktop/electron/my-electron/build/icons/256x256.png'
  )
  const contextMenu = Menu.buildFromTemplate([{
      label: '上一首',
      click() {
        mainWindow.send('playPrev')
      }
    },
    {
      label: '播放/暂停',
      click() {
        mainWindow.send('togglePlay')
      }
    }, {
      label: '下一首',
      click() {
        mainWindow.send('playNext')
      }
    }
  ])
  tray.setToolTip('This is my application.')
  tray.setTitle('标题')
  tray.setContextMenu(contextMenu)
  tray.on('right-click', () => {
    console.log(1111)
  })

  tray.on('drop-file', () => {
    console.log(2222)
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('miniSize', () => {
    mainWindow.minimize()
  })

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    let name = item.getFilename();
    item.setSavePath('C:\\Users\\Administrator\\Desktop\\测试文件\\' + name);
    downloadItems[Math.round(item.getStartTime())] = item;
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
        delete downloadItems[Math.round(item.getStartTime())];
      } else if (state === 'cancelled') {
        console.log("下载取消");
      }
    })
  })



  // const ret = globalShortcut.register('CommandOrControl+X', () => { //注册快捷键
  //   mainWindow.minimize()
  // })
}
// console.log(process.versions.electron)

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('blur', () => {
  console.log(12313)
})
ipcMain.on('miniSize', () => mainWindow.minimize())
ipcMain.on('maxSize', () => {
  mainWindow[mainWindow.isMaximized() ? 'unmaximize' : 'maximize']()
})
ipcMain.on('close', () => mainWindow.minimize())

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
  console.log(musicArr)

})


ipcMain.on('download', (e, data, status) => {
  console.log("参数：" + data)
  let downloadItem = downloadItems[Math.round(data)];
  if (!downloadItem) return;
  console.log(status)
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
// ipcMain.on('playPrev', (event) => {
//   event.reply('playPrevMusic')
// })
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */