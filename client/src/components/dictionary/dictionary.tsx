/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Language } from '@common/types';

const Dictionary = ({ languageData, content }: { languageData: Language, content: string }): JSX.Element => {
	const scale = 0.95;

	return (
		<iframe
			src={
				languageData.dictionaryUrl.replace(
					'%s',
					(languageData.shouldShowSpaces
						? content
						: content.replace(new RegExp(languageData.whitespaces, 'ug'), '')
						) || ''
				)
			}
			style={{
				width: `${100/scale}%`,
				height: `${40/scale}%`,
				position: "absolute",
				left: "0",
				top: "60%",
				transformOrigin: "0 0",
				scale: `${scale}`,
				border: "none",
				boxShadow: "0 0 0 2px #DDDDDDFF",
				borderRadius: "0.5rem",
				marginTop: "0.5rem",
			}}
		/>
	);
};

export { Dictionary };
