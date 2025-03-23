/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TextProcessor } from '@common/types';
import { StrictModeDroppable } from '../strict-mode-droppable';

const TextProcessorColumn = (
	{ columnType, textProcessors }: { columnType: string, textProcessors: TextProcessor[] }
): JSX.Element => {
	return (
		<div>
			<h3>{columnType}</h3>
			<StrictModeDroppable droppableId={columnType}>
				{
					(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{
								textProcessors.map(
									(textProcessor, index) => (
										<Draggable
											draggableId={textProcessor.pluginId + '/' + textProcessor.id}
											key={textProcessor.pluginId + '/' + textProcessor.id}
											index={index}
										>
											{
												(provided) => (
													<div
														key={textProcessor.pluginId + '/' + textProcessor.id}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														ref={provided.innerRef}
													>
														<p>{textProcessor.name}</p>
														<p>{textProcessor.pluginId}</p>
													</div>
												)
											}
										</Draggable>
									)
								)
							}
							{provided.placeholder}
						</div>
					)
				}
			</StrictModeDroppable>
		</div>
	);
};

export { TextProcessorColumn };
