const { app, BrowserWindow, Menu,ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

let win;

const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      nodeIntegration: true,
      frame:false,
      fullscreen:true,
      webPreferences:
      {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    win.maximize();
    win.loadFile('index.html')
  }
  app.whenReady().then(() => {
    // Menu.setApplicationMenu(null)
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  ipcMain.on("toMain", (event, args) => {
      if(args == 'getFile')
      {
      console.log(args);
        fs.readFile(path.join(__dirname, 'tests.json'), (error, data) => {
            win.webContents.send("fromMain", JSON.parse(data));
          });
      } else if(args == 'exit')
      {
          app.quit();
      }
 
  });