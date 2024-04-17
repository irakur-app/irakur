/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React from 'react';

import { Entry } from './entry';

const statusStyles: Record<string, string> = {
	'0': '#ADDFF4FF',
	'1': '#F5B8A9FF',
	'2': '#F5CCA9E5',
	'3': '#F5E1A9BF',
	'4': '#F5F3A99F',
	'5': '#DDFFDD7F',
	'99': '#FFFFFF00',
	'98': '#FFFFFF00',
}

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFF00';
}

const EditWord = (): JSX.Element => {
	return (
		<form>
			<input type="text" name="content" placeholder="Word content" />
			<br />
			<Entry />
			<br />
			<input type="text" name="notes" placeholder="Notes" />
			<br />
			<input type="submit" value="1" />
			<input type="submit" value="2" />
			<input type="submit" value="3" />
			<input type="submit" value="4" />
			<input type="submit" value="5" />
			<input type="submit" value="99" />
			<input type="submit" value="98" />
		</form>
	);
};

export { EditWord };
