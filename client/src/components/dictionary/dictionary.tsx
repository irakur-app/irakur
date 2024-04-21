/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const Dictionary = ({ url }: { url: string }): JSX.Element => {
	const scale = 0.95;

	return (
		<iframe
			src={url}
			style={{
				width: `${100/scale}%`,
				height: `${50/scale}%`,
				position: "absolute",
				left: "0",
				top: "50%",
				transformOrigin: "0 0",
				scale: `${scale}`,
				border: "1px solid #00000066",
				borderRadius: "0.5rem",
			}}
		/>
	);
};

export { Dictionary };
