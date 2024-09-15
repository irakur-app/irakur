/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

// Adapted from https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194

import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
	const [enabled, setEnabled] = useState(false);

	useEffect(
		() => {
			const animation = requestAnimationFrame(
				() => setEnabled(true)
			);

			return () => {
				cancelAnimationFrame(animation);
				setEnabled(false);
			};
		},
		[]
	);

	if (!enabled) {
		return null;
	}

	return (
		<Droppable {...props}>
			{children}
		</Droppable>
	);
};

export { StrictModeDroppable };
