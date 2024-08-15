/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { app, BrowserWindow } from 'electron';

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL('http://localhost:3000');
	mainWindow.on('closed', () => mainWindow = null);
}

app.whenReady().then(
	() => {
		createWindow();
	}
);

app.on(
	'window-all-closed',
	() => {
		app.quit();
	}
);
