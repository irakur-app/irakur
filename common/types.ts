/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

type Language = {
	id: number;
	name: string;
	shouldShowSpaces: boolean;
	dictionaryUrl: string;
};

type Text = {
	id: number;
	languageId: number;
	title: string;
	sourceUrl: string;
	numberOfPages?: number;
	datetimeOpened: string | null;
	datetimeFinished: string | null;
	progress: number;
};

type Page = {
	textId: number;
	number: number;
	content: string;
};

type ReducedWordData = {
	content: string;
	status: number | null;
	type: string;
	potentialMultiword: boolean | undefined;
	items: ReducedWordData[] | undefined;
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
	datetimeAdded: string;
	datetimeUpdated: string;
	itemCount: number;
};

type RawWord = {
	id: number;
	languageId: number;
	content: string;
	status: number;
	notes: string;
	datetimeAdded: string;
	datetimeUpdated: string;
	itemCount: number;
};

export type { Language, Text, Page, ReducedWordData, Entry, Word, RawWord };
