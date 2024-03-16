/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Text, Page } from '@common/types';
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class TextsController
{
	async addText(languageId: number, title: string, content: string, sourceUrl: string, numberOfPages: number): Promise<void>
	{
		await databaseManager.executeQuery(queries.addText,
			[languageId, title, sourceUrl]
		);

		const sentences: string[] = content.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
			.filter((sentence: string) => sentence !== '');
		const sentencesPerPage: number = Math.floor(sentences.length / numberOfPages);

		const textId: number = (await databaseManager.getLastInsertId()).id;

		let firstPageIndex: number = 0;
		let lastPageIndex: number = sentencesPerPage + (sentences.length % numberOfPages > 0 ? 0 : -1);
		for (let i = 0; i < numberOfPages; i++)
		{
			const pageContent: string = sentences.slice(firstPageIndex, lastPageIndex+1).join('') // Do not trim! It will cause data loss
			await databaseManager.executeQuery(queries.addPage,
				[textId, i+1, pageContent]
			);

			firstPageIndex = lastPageIndex + 1;
			lastPageIndex = firstPageIndex + sentencesPerPage + ((i + 1) < sentences.length % numberOfPages ? 0 : -1);
		}
	}

	async getAllTexts(): Promise<Text[]>
	{
		const texts: Text[] = await databaseManager.executeQuery(queries.getAllTexts);

		return texts;
	}

	async getTextsByLanguage(languageId: number): Promise<Text[]>
	{
		const texts: Text[] = await databaseManager.executeQuery(queries.getTextsByLanguage,
			[languageId]
		);

		return texts;
	}

	async getText(textId: number): Promise<Text>
	{
		const text: Text = await databaseManager.getFirstRow(queries.getText,
			[textId]
		)

		return text;
	}

	async getNumberOfPages(textId: number): Promise<number>
	{
		const numberOfPages: number = (await databaseManager.executeQuery(queries.getAllPages,
			[textId]
		)).length;

		return numberOfPages;
	}

	async deleteText(textId: number): Promise<void>
	{
		const pages: Page[] = await databaseManager.executeQuery(queries.getAllPages,
			[textId]
		);
		for (const page of pages)
		{
			await databaseManager.executeQuery(queries.deletePage,
				[textId, page.number]
			);
		}

		await databaseManager.executeQuery(queries.deleteText,
			[textId]
		)
	}

	async editText(languageId: number, title: string, sourceUrl: string, numberOfPages: number, content: string, textId: number): Promise<void>
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = await databaseManager.getFirstRow(queries.getLanguage, [languageId]);
			if (!language)
			{
				console.error('Language does not exist.');
				return;
			}
			updates.push('language_id = ?');
			queryParams.push(languageId);
		}
		if (title !== undefined)
		{
			updates.push('title = ?');
			queryParams.push(title);
		}
		if (sourceUrl !== undefined)
		{
			updates.push('source_url = ?');
			queryParams.push(sourceUrl);
		}
		if (numberOfPages !== undefined || content !== undefined)
		{
			const pages: Page[] = await databaseManager.executeQuery(queries.getAllPages,
				[textId]
			);

			const newNumberOfPages: number = (numberOfPages !== undefined) ? numberOfPages : pages.length;

			const newContent: string = (content !== undefined) ? content : pages.map((page: Page) => page.content).join('');

			const sentences: string[] = newContent.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
				.filter((sentence: string) => sentence !== '');
			const sentencesPerPage: number = Math.floor(sentences.length / newNumberOfPages);

			let firstPageIndex: number = 0;
			let lastPageIndex: number = sentencesPerPage + (sentences.length % newNumberOfPages > 0 ? 0 : -1);
			for (let i = 0; i < newNumberOfPages; i++)
			{
				const pageContent: string = sentences.slice(firstPageIndex, lastPageIndex+1).join('') // Do not trim! It will cause data loss
				if(i < pages.length)
				{
					await databaseManager.executeQuery(queries.editPage,
						[pageContent, textId, i+1]
					);
				}
				else
				{
					await databaseManager.executeQuery(queries.addPage,
						[textId, i+1, pageContent]
					);
				}

				firstPageIndex = lastPageIndex + 1;
				lastPageIndex = firstPageIndex + sentencesPerPage + ((i + 1) < sentences.length % numberOfPages ? 0 : -1);
			}
			for (let i = newNumberOfPages; i < pages.length; i++)
			{
				await databaseManager.executeQuery(queries.deletePage,
					[textId, (i+1).toString()]
				);
			}
		}

		if (updates.length > 0)
		{
			queryParams.push(textId);
			console.log(queryParams);

			const dynamicQuery: string = queries.editText.replace(/\%DYNAMIC\%/, (): string => {
				return updates.join(', ');
			});

			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
	}
}

export { TextsController };