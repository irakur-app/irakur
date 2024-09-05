/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Plugin, IrakurApi, TextProcessor } from './irakur-api';

const uppercaseTextProcessor: TextProcessor = {
	name: 'Convert to uppercase',
	pluginName: 'Plugin 1',
	languages: null,
	processText: async (text: string): Promise<string> => {
		return text.toUpperCase();
	},
};

const newLinesTextProcessor: TextProcessor = {
	name: 'Add new lines',
	pluginName: 'Plugin 1',
	languages: null,
	processText: async (text: string): Promise<string> => {
		return text.replace(/\s/g, '\n');
	},
};

const plugin: Plugin = {
	name: 'Plugin 1',
	start: async (irakurApi: any) => {
		irakurApi.plugins.registerTextProcessor(uppercaseTextProcessor);
		irakurApi.plugins.registerTextProcessor(newLinesTextProcessor);
	},
};

const initPlugin = (irakurApi: IrakurApi) => {
	irakurApi.plugins.register(plugin);
};

export default initPlugin;