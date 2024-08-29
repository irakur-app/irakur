/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

declare var process: any;

const getUnixTime = (): number =>
{
	return Math.floor(Date.now() / 1000);
};

const tokenizeString = (str: string, alphabet: string, intrawordPunctuation: string): string[] =>
{
	/*
	 * This regular expression captures the characters do NOT appear in words.
	 * It accounts for characters that may appear inside words but not at the beginning or at the end.
	 * 
	 * There are three cases:
	 * 	1. Intraword punctuation is followed by a non-alphabetical character:
	 *      e.g. She said 'bye' and left (the second ' is followed by a whitespace)
	 * 	2. Intraword punctuation is preceded by a non-alphabetical character:
	 *      e.g. She said 'bye' and left (the first ' is preceded by a whitespace)
	 * 	3. Non-intraword punctuation, i.e. most token separators, such as whitespaces.
	 * 
	 * Note that we avoided to capture intraword punctuation that is surrounded by alphabet characters:
	 * 	e.g. She didn't leave (the ' inside didn't will not be captured).
	 */
	const tokenSplitter = new RegExp(
		"("
			+ intrawordPunctuation + "(?!" + alphabet + ")"
			+ "|(?<!"+ alphabet + ")" + intrawordPunctuation
			+ "|(?!" + alphabet + "|" + intrawordPunctuation + ").|\n"
			+ ")",
		'u'
	);
	const tokens: string[] = str.split(tokenSplitter) 
		.filter((sentence: string) => sentence !== '');

	return tokens;
};

const getEnvironmentVariable = (name: string): string =>
{
	if (process.env[name] !== undefined)
	{
		return process.env[name] as string;
	}
	else
	{
		throw new Error(`Environment variable ${name} not found`);
	}
};

export { getEnvironmentVariable, getUnixTime, tokenizeString };
