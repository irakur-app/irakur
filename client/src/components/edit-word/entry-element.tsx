/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React from 'react';

const EntryElement = (): JSX.Element => {
	return (
		<React.Fragment>
			<input type="text" name="meaning" placeholder="Meaning" />
			<input type="text" name="reading" placeholder="Reading" />
		</React.Fragment>
	);
};

export { EntryElement };
