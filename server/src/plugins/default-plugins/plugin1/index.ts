/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Plugin, IrakurApi } from './irakur-api';

const plugin: Plugin = {
	name: 'Plugin 1',
	start: async () => {
		console.log('Plugin 1 started!');
	},
};

const initPlugin = (irakurApi: IrakurApi) => {
	irakurApi.plugins.register(plugin);
};

export default initPlugin;