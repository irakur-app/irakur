/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class TextsController
{
	async addText(languageId: number, title: string, content: string, sourceUrl: string, numberOfPages: number)
	{
		await databaseManager.executeQuery(queries.addText,
			[languageId, title, sourceUrl]
		);

		const sentences = content.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
			.filter((sentence:string) => sentence !== '');
		const sentencesPerPage = Math.floor(sentences.length / numberOfPages);

		const textId = (await databaseManager.getLastInsertId()).id;

		let firstPageIndex = 0;
		let lastPageIndex = sentencesPerPage + (sentences.length % numberOfPages > 0 ? 0 : -1);
		for (let i = 0; i < numberOfPages; i++)
		{
			const pageContent = sentences.slice(firstPageIndex, lastPageIndex+1).join('') // Do not trim! It will cause data loss
			await databaseManager.executeQuery(queries.addPage,
				[textId, i+1, pageContent]
			);

			firstPageIndex = lastPageIndex + 1;
			lastPageIndex = firstPageIndex + sentencesPerPage + ((i + 1) < sentences.length % numberOfPages ? 0 : -1);
		}

		return true;
	}

	async getAllTexts()
	{
		const texts = await databaseManager.executeQuery(queries.getAllTexts);

		return texts;
	}

	async getTextsByLanguage(languageId: number)
	{
		const texts = await databaseManager.executeQuery(queries.getTextsByLanguage,
			[languageId]
		);

		return texts;
	}

	async getText(textId: number)
	{
		const text = await databaseManager.getFirstRow(queries.getText,
			[textId]
		)

		return text;
	}

	async getNumberOfPages(textId: number)
	{
		const numberOfPages = (await databaseManager.executeQuery(queries.getAllPages,
			[textId]
		)).length;

		return numberOfPages;
	}

	async deleteText(textId: number)
	{
		const pages = await databaseManager.executeQuery(queries.getAllPages,
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

		return true;
	}

	async editText(languageId: number, title: string, sourceUrl: string, numberOfPages: number, content: string, textId: number)
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = await databaseManager.getFirstRow(queries.getLanguage, [languageId]);
			if (!language)
			{
				console.error('Language does not exist.');
				return false;
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
			const pages = await databaseManager.executeQuery(queries.getAllPages,
				[textId]
			);

			const newNumberOfPages = (numberOfPages !== undefined) ? numberOfPages : pages.length;

			const newContent = (content !== undefined) ? content : pages.map((page:any) => page.content).join('');

			const sentences = newContent.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
				.filter((sentence:string) => sentence !== '');
			const sentencesPerPage = Math.floor(sentences.length / newNumberOfPages);

			let firstPageIndex = 0;
			let lastPageIndex = sentencesPerPage + (sentences.length % newNumberOfPages > 0 ? 0 : -1);
			for (let i = 0; i < newNumberOfPages; i++)
			{
				const pageContent = sentences.slice(firstPageIndex, lastPageIndex+1).join('') // Do not trim! It will cause data loss
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

			const dynamicQuery = queries.editText.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});

			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}

		return true;
	}
}

export { TextsController };