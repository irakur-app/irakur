/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

type TextProcessorReference = {
	pluginId: string;
	textProcessorId: string;
};

type WordDataProviderReference = {
	pluginId: string;
	wordDataProviderId: string;
};

type Language = {
	id: number;
	name: string;
	shouldShowSpaces: boolean;
	dictionaryUrl: string;
	alphabet: string;
	sentenceDelimiters: string;
	whitespaces: string;
	intrawordPunctuation: string;
	templateCode: string;
	scriptName: string;
	textProcessors: string;
	wordDataProvider: string;
};

type Text = {
	id: number;
	languageId: number;
	title: string;
	sourceUrl: string;
	numberOfPages?: number;
	timeOpened: number | null;
	timeFinished: number | null;
	progress: number;
};

type Page = {
	textId: number;
	position: number;
	content: string;
};

type ReducedWordData = {
	content: string;
	status: number | null;
	type: string;
	potentialMultiword: boolean | undefined;
	tokens: ReducedWordData[] | undefined;
	index: number;
};

type Entry = {
	meaning: string,
	reading: string
};

type Word = {
	id: number;
	languageId: number;
	content: string;
	status: number;
	entries: Entry[];
	notes: string;
	timeAdded: number;
	timeUpdated: number;
	tokenCount: number;
};

type RawWord = {
	id: number;
	languageId: number;
	content: string;
	status: number;
	notes: string;
	timeAdded: number;
	timeUpdated: number;
	tokenCount: number;
};

type Collection = {
	id: number,
	name: string;
}

type TextProcessor = {
	id: string;
	name: string;
	supportedLanguages: string[] | Symbol;
	pluginId: string;
};

type WordDataProvider = {
	id: string;
	name: string;
	targetLanguage: string;
	auxiliaryLanguage: string;
	pluginId: string;
};

type DictionaryEntry = {
	reading?: string;
	meaning?: string;
};

type DictionaryWordData = {
	wordContent?: string;
	entries?: DictionaryEntry[];
	notes?: string;
};

export type {
	Language,
	Text,
	TextProcessorReference,
	Page,
	ReducedWordData,
	Entry,
	Word,
	Collection,
	WordDataProviderReference,
	RawWord,
	TextProcessor,
	WordDataProvider,
	DictionaryWordData
};
