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

const tokenizeString = (str: string, alphabet: string): string[] =>
{
	const tokens: string[] = str.split(new RegExp(`((?!${alphabet}).|\n)`, 'u'))
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
