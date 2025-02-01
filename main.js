const electron = require('electron');
const fs = require('fs');
const { app, BrowserWindow, ipcMain, dialog, Menu } = electron;
let win;
let filepath;

app.on('ready', () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('index.html');
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
})

ipcMain.on('save', (event, text) => {
    // save the text to a file
    if(filepath === undefined) {
        dialog.showSaveDialog(win, {defaultPath: 'filename.txt'}, (fullpath) => {
        if(fullpath) {
            filepath = fullpath;
            writeToFile(text);
            }
        })

    } else {
        writeToFile(text);
    }
        
})

function writeToFile(data) {
    fs.writeFile(filepath, data, (err) => {
        if(err) {
            console.log('there was an error ', err)
        } else {
            console.log('file has been saved');
        }
        win.webContents.send('saved', 'success');
    });
}

const menuTemplate = [
    ...(process.platform == 'darwin'? [{
        label: app.getName(),
        submenu: [
            {role: 'about'}
        ]
    }] : []),
    {
        label: "File",
        submenu: [
            {
                label: "Save",
                click() {
                    console.log("Save from menu")
                }
            },
            {
                label: "Save As",
                click() {
                    console.log("Save as from menu")
                }
            }
        ]
    },
    {
        role: "editMenu"
    }
]