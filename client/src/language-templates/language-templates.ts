/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

type LanguageTemplate = {
	// General properties of target language:
	nativeName: string;
	alphabet: string;
	sentenceDelimiters: string;
	whitespaces: string;
	intrawordPunctuation: string;
	shouldShowSpaces: boolean;
	// Properties of specific templates:
	translatedName: string;
	dictionaryUrl: string;
};

type TemplateCollection = Record<string, Record<string, LanguageTemplate>>;

const languageTemplates: TemplateCollection = {
	English: {
		English: {
			nativeName: 'English',
			alphabet: '[a-zA-Z\\u00C0-\\u024F\\u1E00-\\u1EFF]',
			sentenceDelimiters: '[!.?…]',
			whitespaces: '[\s\\u0085\\u2001-\\u2009\\u200B]',
			intrawordPunctuation: '',
			shouldShowSpaces: true,
			translatedName: 'English',
			dictionaryUrl: 'https://www.dictionary.com/browse/%s',
		},
	},
	Japanese: {
		Japanese: {
			nativeName: '日本語',
			alphabet: '[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤ヶ]+',
			shouldShowSpaces: true, // Since U+200B will be used by default to represent word breaks,
			                        // there's no need to hide whitespaces in general.
			sentenceDelimiters: '[!.?…。．？｡！]',
			whitespaces: '[\s\\u0085\\u2001-\\u2009\\u200B]',
			intrawordPunctuation: '',
			translatedName: '日本語',
			dictionaryUrl: 'https://dictionary.goo.ne.jp/srch/jn/%s/m0u/'
		},
	},
	Spanish: {
		Spanish: {
			nativeName: 'Español',
			alphabet: '[a-zA-ZáéíóúÁÉÍÓÚüÜñÑçÇ]',
			sentenceDelimiters: '[!.?…]',
			whitespaces: '[\s\\u0085\\u2001-\\u2009\\u200B]',
			intrawordPunctuation: '',
			shouldShowSpaces: true,
			translatedName: 'Español',
			dictionaryUrl: 'https://www.wordreference.com/definicion/%s',
		},
	},
};

languageTemplates.English = {
	...languageTemplates.English,
	Spanish: {
		...languageTemplates.English.English,
		translatedName: 'Inglés',
		dictionaryUrl: 'https://www.wordreference.com/es/translation.asp?tranword=%s',
	},
	Japanese: {
		...languageTemplates.English.English,
		translatedName: '英語',
		dictionaryUrl: 'https://www.wordreference.com/enja/%s',
	},
};

languageTemplates.Japanese = {
	...languageTemplates.Japanese,
	English: {
		...languageTemplates.Japanese.Japanese,
		translatedName: 'Japanese',
		dictionaryUrl: 'https://jisho.org/search/%s',
	},
	Spanish: {
		...languageTemplates.Japanese.Japanese,
		translatedName: 'Japonés',
		dictionaryUrl: 'https://aulex.org/japones/?busca=%s',
	},
};

languageTemplates.Spanish = {
	...languageTemplates.Spanish,
	English: {
		...languageTemplates.Spanish.Spanish,
		translatedName: 'Español',
		dictionaryUrl: 'https://www.wordreference.com/es/en/translation.asp?spen=%s',
	},
	Japanese: {
		...languageTemplates.Spanish.Spanish,
		translatedName: 'Español',
		dictionaryUrl: 'https://aulex.org/japones/?busca=%s',
	},
};

export { languageTemplates };