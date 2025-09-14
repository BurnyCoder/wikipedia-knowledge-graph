const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let flaskProcess;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'Wikipedia Knowledge Graph'
    });

    // Load the Flask app
    mainWindow.loadURL('http://localhost:5556');

    // Create application menu
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Rebuild Graph',
                    click: async () => {
                        const result = await dialog.showMessageBox(mainWindow, {
                            type: 'question',
                            buttons: ['Yes', 'No'],
                            defaultId: 0,
                            message: 'Rebuild graph from Wikipedia?',
                            detail: 'This will fetch fresh data from Wikipedia and rebuild the entire graph.'
                        });
                        
                        if (result.response === 0) {
                            mainWindow.webContents.executeJavaScript('rebuildGraph()');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Ctrl+R',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Option+I' : 'Ctrl+Shift+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Reset Zoom',
                    accelerator: 'Ctrl+0',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(0);
                    }
                },
                {
                    label: 'Zoom In',
                    accelerator: 'Ctrl+=',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 1);
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'Ctrl+-',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 1);
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About',
                            message: 'Wikipedia Knowledge Graph',
                            detail: 'An interactive visualization of Wikipedia article connections.\n\nBuilt with Python, Flask, D3.js, and Electron.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'View on GitHub',
                    click: () => {
                        require('electron').shell.openExternal('https://github.com/BurnyCoder/wikipedia-knowledge-graph');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Handle window closed
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function startFlaskServer() {
    // Check if graph data exists
    const graphDataPath = path.join(__dirname, '..', 'graph-data.json');
    if (!fs.existsSync(graphDataPath)) {
        console.log('Building graph data from Wikipedia...');
        const buildProcess = spawn('python', [path.join(__dirname, '..', 'build_graph.py')]);
        
        buildProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Graph data built successfully');
                launchFlask();
            } else {
                console.error('Failed to build graph data');
                dialog.showErrorBox('Error', 'Failed to build graph data. Please run build_graph.py manually.');
                app.quit();
            }
        });
    } else {
        launchFlask();
    }
}

function launchFlask() {
    // Start Flask server with a different port to avoid conflicts
    const appPath = path.join(__dirname, '..', 'app.py');
    
    // Modify the Flask app to run on port 5556
    flaskProcess = spawn('python', ['-c', `
import sys
sys.path.insert(0, '${path.dirname(appPath)}')
from app import app
app.run(port=5556, debug=False, use_reloader=False)
    `]);

    flaskProcess.stdout.on('data', (data) => {
        console.log(`Flask: ${data}`);
    });

    flaskProcess.stderr.on('data', (data) => {
        console.error(`Flask Error: ${data}`);
    });

    // Wait for Flask to start, then create window
    setTimeout(() => {
        createWindow();
    }, 2000);
}

// App event handlers
app.whenReady().then(() => {
    startFlaskServer();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (flaskProcess) {
        flaskProcess.kill();
    }
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    if (flaskProcess) {
        flaskProcess.kill();
    }
});