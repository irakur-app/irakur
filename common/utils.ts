/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const tokenizeString = (str: string): string[] =>
{
	const tokens: string[] = str.split(/([ \r\n"':;,.¿?¡!()\-=。、！？：；「」『』（）…＝・’“”—\d])/u)
		.filter((sentence: string) => sentence !== '');

	return tokens;
}

export { tokenizeString };
