const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    //   frame:false,
      fullscreen:true,
      webPreferences:
      {
        // preload: path.join(__dirname, 'renderer.js')
      }
    })
    win.maximize();
    win.loadFile('index.html')
  }
  app.whenReady().then(() => {
    // Menu.setApplicationMenu(null)
    createWindow()
  })
