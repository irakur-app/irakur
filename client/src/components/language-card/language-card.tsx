/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const LanguageCard = (props: any) => {
	return (
		<div>
			<p>Name: {props.name}</p>
			<p>ID: {props.id}</p>
		</div>
	)
}

export { LanguageCard };