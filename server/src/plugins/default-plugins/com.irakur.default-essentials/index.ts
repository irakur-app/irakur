/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { DictionaryWordData, Plugin, TextProcessor, WordDataProvider, irakur } from './irakur-api';
import { tokenize } from '@enjoyjs/node-mecab';

const spaceInserter: TextProcessor = {
	id: 'mecab-space-inserter',
	name: 'Add spaces',
	supportedLanguages: ['Japanese'],
	processText: async (text: string): Promise<string> => {
		const tokens = await tokenize(text);

		return tokens
			.filter((token) => token.stat === 'NORMAL' || token.stat === 'UNKNOWN')
			.map((token) => token.surface)
			.join('\u200B');
	},
};

const jishoFetcher: WordDataProvider = {
	id: 'jisho-fetcher',
	name: 'Jisho Fetcher',
	targetLanguage: 'Japanese',
	auxiliaryLanguage: 'English',
	getWordData: async (wordContent: string): Promise<DictionaryWordData | null> => {
		const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${wordContent}`);
		const json = await response.json();

		if (json.data.length === 0) {
			return null;
		}

		const suitableWords = json.data.filter(
			(word: any, index: number) => word.japanese.find(
				(japanese: any) => japanese.word === wordContent
					|| japanese.reading === wordContent
					|| (
						(
							!japanese.word
								|| !japanese.reading
								|| japanese.word.startsWith(wordContent.substring(0, wordContent.length - 1))
								|| japanese.reading.startsWith(wordContent.substring(0, wordContent.length - 1))
						)
						&& (
							(index <= 2
								&& word.senses.find(
									(sense: any) => sense.parts_of_speech.find(
										(partOfSpeech: any) => /(?<!Suru) verb$/.test(partOfSpeech)
									) !== undefined
								) !== undefined
							)
							|| (index <= 1
								&& wordContent.charAt(wordContent.length - 1) === 'く'
								&& word.senses.find(
									(sense: any) => sense.parts_of_speech.find(
										(partOfSpeech: any) => /.*adjective.*/m.test(partOfSpeech)
									) !== undefined
								) !== undefined
							)
						)
					)
			) !== undefined
		);

		return {
			wordContent: wordContent,
			entries: suitableWords.map(
				(word: any) => {
					const meaning: string = word.senses.map(
						(sense: any, index: number) => (index + 1) + '. ' + sense.english_definitions.join('; ')
					).join('\n');
					
					const readingItems = word.japanese.filter(
						(japanese: any) => japanese.word === wordContent || japanese.reading === wordContent
					);

					const readingItem = readingItems.length > 0
					 	? readingItems[0]
						: word.japanese[0];

					return {
						meaning: meaning,
						reading: (readingItem.reading === wordContent)
							? (readingItem.word) !== undefined 
								? readingItem.word
								: undefined
							: readingItem.reading,
					};
				}
			),
			notes: '',
		};
	},
}

const plugin: Plugin = {
	id: 'com.irakur.default-essentials',
	name: 'Processors and Autocompleters for Default Languages',
	start: async () => {
		irakur.plugins.registerTextProcessor(spaceInserter);
		irakur.plugins.registerWordDataProvider(jishoFetcher);
	},
};

const initPlugin = () => {
	irakur.plugins.register(plugin);
};

export default initPlugin;
