/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

type DictionaryEntry = {
	reading?: string;
	meaning?: string;
};

type DictionaryWordData = {
	wordContent?: string;
	entries?: DictionaryEntry[];
	notes?: string;
};

interface Plugin
{
	id: string;
	name: string;
	description?: string;
	start?: () => Promise<void>;
};

interface TextProcessor
{
	id: string;
	name: string;
	description?: string;
	supportedLanguages: string[] | Symbol;
	processText: (text: string) => Promise<string>;
	prepare?: () => Promise<void>;
};

interface WordDataProvider
{
	id: string;
	name: string;
	description?: string;
	targetLanguage: string;
	auxiliaryLanguage: string;
	getWordData: (wordContent: string) => Promise<DictionaryWordData | null>;
	prepare?: () => Promise<void>;
};

interface IrakurApi
{
	plugins: {
		register: (plugin: Plugin) => void;
		registerTextProcessor: (textProcessor: TextProcessor) => void;
		registerWordDataProvider: (wordDataProvider: WordDataProvider) => void;
	};
	symbols: {
		anyLanguage: Symbol;
	};
};

const irakur: IrakurApi = global.irakur;

export { DictionaryEntry, Plugin, IrakurApi, TextProcessor, WordDataProvider, DictionaryWordData, irakur };
