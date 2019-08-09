const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, dialog, BrowserWindow, Menu, ipcMain} = electron;


// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;
let aboutWindow;

// Listen for app to be ready
app.on('ready', function(){
  //Create new window
  mainWindow = new BrowserWindow({
    webPreferences: {nodeIntegration: true}
  });
  // Load HTML into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true,
    preload: path.join(__dirname, 'preload.js')
  }));
  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
  //Create new window
  addWindow = new BrowserWindow({
    width: 500,
    height: 200,
    title: 'Add Shopping List Item',
    webPreferences: {nodeIntegration: true}
  });
  // Load HTML into window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true,
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  })
}

// Handle createAboutWindow
function createAboutWindow(){
  // Create new window
  aboutWindow = new BrowserWindow({
    width: 500,
    height: 400,
    title: 'About Shopping List',
    webPreferences: {nodeIntegration: true}
  });
  // Loat HTML into window
  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'aboutWindow.html'),
    protocol: 'file',
    slashes: true,
  }));
  // Handle garbage collection
  aboutWindow.on('close', function(){
    aboutWindow = null;
  })
}

// Catch item add
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  // addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() { createAddWindow(); }
      },
      {
        label: 'Save As...',
        accelerator: process.platform == 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S',
        click() { dialog.showSaveDialog(); }
      },
      {
        label: 'Clear List',
        accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() { app.quit(); }
      }
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click() { createAboutWindow(); }
      }
    ],
  }
];

// If mac, add empty object to menu to remove electron label
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add dev tools item if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}