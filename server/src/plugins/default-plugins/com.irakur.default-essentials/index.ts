/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Plugin, TextProcessor, irakur } from './irakur-api';
import { tokenize } from '@enjoyjs/node-mecab';

const spaceInserter: TextProcessor = {
	id: 'mecab-space-inserter',
	name: 'Add spaces',
	languages: ['Japanese'],
	processText: async (text: string): Promise<string> => {
		const tokens = await tokenize(text);

		return tokens
			.filter((token) => token.stat === 'NORMAL' || token.stat === 'UNKNOWN')
			.map((token) => token.surface)
			.join('\u200B');
	},
};

const plugin: Plugin = {
	id: 'com.irakur.default-essentials',
	name: 'Processors and Autocompleters for Default Languages',
	start: async () => {
		irakur.plugins.registerTextProcessor(spaceInserter);
	},
};

const initPlugin = () => {
	irakur.plugins.register(plugin);
};

export default initPlugin;
