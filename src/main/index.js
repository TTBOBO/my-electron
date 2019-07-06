import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  ipcRenderer
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
    titleBarStyle: 'hidden'
  })

  const tray = new Tray(
    'C:/Users/TAB000/Desktop/my-electron/build/icons/256x256.png'
  )
  console.log(process.platform === 'darwin')
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
  // console.log(arg)
  let musicArr = [];
  let path = 'C:\\Users\\Administrator\\Desktop\\测试文件'
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
  // mainWindow.send('playLocaMusic', musicArr)
  console.log(musicArr)
  //C:\Users\Administrator\Desktop

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