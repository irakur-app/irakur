/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Language } from '@common/types';

import { backendConnector } from '../../backend-connector';
import { Link } from 'react-router-dom';

const LanguageCard = ({ language }: { language: Language }): JSX.Element => {
	const handleDelete = async (): Promise<void> => {
		const enteredText: string | null = prompt("Do you really want to delete language '" + language.name + "' (ID: " + language.id + ")?\n*It will permanently delete all texts and all words associated with it*.\nType 'DELETE' to confirm.");
		if (enteredText !== "DELETE") {
			alert("Deletion canceled. Incorrect confirmation text.");
			return;
		}

		const wasDeleted: boolean = await backendConnector.deleteLanguage(language.id);
		if (wasDeleted) {
			window.location.reload();
		}
	};

	return (
		<div>
			<p>Name: {language.name}</p>
			<p>ID: {language.id}</p>
			<Link to={`/languages/edit/${language.id}`}>Edit</Link>
			<button onClick={handleDelete}>Delete</button>
		</div>
	);
};

export { LanguageCard };