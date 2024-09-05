/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Plugin, TextProcessor, irakur } from './irakur-api';

const uppercaseTextProcessor: TextProcessor = {
	name: 'Convert to uppercase',
	languages: null,
	processText: async (text: string): Promise<string> => {
		return text.toUpperCase();
	},
};

const newLinesTextProcessor: TextProcessor = {
	name: 'Add new lines',
	languages: null,
	processText: async (text: string): Promise<string> => {
		return text.replace(/\s/g, '\n');
	},
};

const plugin: Plugin = {
	name: 'Plugin 1',
	start: async () => {
		irakur.plugins.registerTextProcessor(uppercaseTextProcessor);
		irakur.plugins.registerTextProcessor(newLinesTextProcessor);
	},
};

const initPlugin = () => {
	irakur.plugins.register(plugin);
};

export default initPlugin;