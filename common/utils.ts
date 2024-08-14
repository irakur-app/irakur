/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

const getUnixTime = (): number =>
{
	return Math.floor(Date.now() / 1000);
}

const tokenizeString = (str: string): string[] =>
{
	const tokens: string[] = str.split(/([ \r\n"':;,.¿?¡!()\-=。、！？：；「」『』（）…＝・’“”—\d])/u)
		.filter((sentence: string) => sentence !== '');

	return tokens;
}

export { getUnixTime, tokenizeString };
