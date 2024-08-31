/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

type SpecificProperties = {
	translatedName: string;
	dictionaryUrl: string;
};

type BaseProperties = {
	nativeName: string;
	alphabet: string;
	sentenceDelimiters: string;
	whitespaces: string;
	intrawordPunctuation: string;
	shouldShowSpaces: boolean;
	script: string;
};

type LanguageTemplate = BaseProperties & SpecificProperties;

type TargetLanguage = BaseProperties & {
	templates: Record<string, SpecificProperties>;
};

type TargetLanguageRecord = Record<string, TargetLanguage>;

const targetLanguages: TargetLanguageRecord = {
	English: {
		nativeName: 'English',
		alphabet: '[a-zA-Z\\u00C0-\\u024F\\u1E00-\\u1EFF]',
		sentenceDelimiters: '[!.?…]',
		whitespaces: '[\s\\u0085\\u2001-\\u2009\\u200B]',
		intrawordPunctuation: '',
		shouldShowSpaces: true,
		script: 'Latin',
		templates: {
			English: {
				translatedName: 'English',
				dictionaryUrl: 'https://www.dictionary.com/browse/%s',
			},
			Spanish: {
				translatedName: 'Inglés',
				dictionaryUrl: 'https://www.wordreference.com/es/translation.asp?tranword=%s',
			},
			Japanese: {
				translatedName: '英語',
				dictionaryUrl: 'https://www.wordreference.com/enja/%s',
			},
		},
	},
	Japanese: {
		nativeName: '日本語',
		alphabet: '[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤ヶ]+',
		shouldShowSpaces: true, // Since U+200B will be used by default to represent word breaks,
								// there's no need to hide whitespaces in general.
		sentenceDelimiters: '[!.?…。．？｡！]',
		whitespaces: '[\s\\u0085\\u2001-\\u2009\\u200B]',
		intrawordPunctuation: '',
		script: 'Japanese',
		templates: {
			Japanese: {
				translatedName: '日本語',
				dictionaryUrl: 'https://dictionary.goo.ne.jp/srch/jn/%s/m0u/'
			},
			English: {
				translatedName: 'Japanese',
				dictionaryUrl: 'https://jisho.org/search/%s',
			},
			Spanish: {
				translatedName: 'Japonés',
				dictionaryUrl: 'https://aulex.org/japones/?busca=%s',
			},
		}
	},
	Spanish: {
		nativeName: 'Español',
		alphabet: '[a-zA-Z\\u00C0-\\u024F\\u1E00-\\u1EFF]',
		sentenceDelimiters: '[!.?…]',
		whitespaces: '[\s\\u0085\\u2001-\\u2009\\u200B]',
		intrawordPunctuation: '',
		shouldShowSpaces: true,
		script: 'Latin',
		templates: {
			Spanish: {
				translatedName: 'Español',
				dictionaryUrl: 'https://www.wordreference.com/definicion/%s',
			},
			English: {
				translatedName: 'Spanish',
				dictionaryUrl: 'https://www.wordreference.com/es/en/translation.asp?spen=%s',
			},
			Japanese: {
				translatedName: 'スペイン語',
				dictionaryUrl: 'https://aulex.org/japones/?busca=%s',
			},
		},
	},
};

const getPartialTemplate = (
	targetLanguageName: string | null,
	auxiliaryLanguageName: string | null
): Partial<LanguageTemplate> => {
	if (targetLanguageName === null || targetLanguageName === '')
	{
		return {};
	}

	const { templates, ...baseProperties } = targetLanguages[targetLanguageName];

	if (auxiliaryLanguageName === null || auxiliaryLanguageName === '')
	{
		return baseProperties;
	}

	const specificProperties = targetLanguages[targetLanguageName].templates[auxiliaryLanguageName];

	return {
		...baseProperties,
		...specificProperties,
	};
};

export { getPartialTemplate, targetLanguages };
