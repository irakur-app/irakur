/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Page, Text } from '@common/types';
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class TextsController
{
	async addText(
		languageId: number,
		title: string,
		content: string,
		sourceUrl: string,
		numberOfPages: number
	): Promise<void>
	{
		await databaseManager.executeQuery(
			queries.addText,
			[languageId, title, sourceUrl]
		);

		const textId: number = (await databaseManager.getLastInsertId()).id;

		await this.updatePage(textId, numberOfPages, content);
	}

	async getAllTexts(): Promise<Text[]>
	{
		const texts: Text[] = await databaseManager.executeQuery(queries.getAllTexts);

		return texts;
	}

	async getTextsByLanguage(languageId: number): Promise<Text[]>
	{
		const texts: Text[] = await databaseManager.executeQuery(
			queries.getTextsByLanguage,
			[languageId]
		);

		return texts;
	}

	async getText(textId: number): Promise<Text>
	{
		const text: Text = await databaseManager.getFirstRow(
			queries.getText,
			[textId]
		);

		return text;
	}

	async getNumberOfPages(textId: number): Promise<number>
	{
		const numberOfPages: number = (await databaseManager.executeQuery(
			queries.getAllPages,
			[textId]
		)).length;

		return numberOfPages;
	}

	async deleteText(textId: number): Promise<void>
	{
		const pages: Page[] = await databaseManager.executeQuery(
			queries.getAllPages,
			[textId]
		);
		for (const page of pages)
		{
			await databaseManager.executeQuery(
				queries.deletePage,
				[textId, page.number]
			);
		}

		await databaseManager.executeQuery(
			queries.deleteText,
			[textId]
		);
	}

	async editText(
		languageId: number,
		title: string,
		sourceUrl: string,
		numberOfPages: number,
		content: string,
		textId: number,
		datetimeOpened: string,
		datetimeFinished: string,
		progress: number
	): Promise<void>
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = await databaseManager.getFirstRow(
				queries.getLanguage,
				[languageId]
			);
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
		if (datetimeOpened !== undefined)
		{
			updates.push('datetime_opened = ?');
			queryParams.push(datetimeOpened);
		}
		if (datetimeFinished !== undefined)
		{
			updates.push('datetime_finished = ?');
			queryParams.push(datetimeFinished);
		}
		if (progress !== undefined)
		{
			updates.push('progress = ?');
			queryParams.push(progress);
		}
		if (numberOfPages !== undefined || content !== undefined)
		{
			await this.updatePage(textId, numberOfPages, content);
		}

		if (updates.length > 0)
		{
			queryParams.push(textId);

			const dynamicQuery: string = queries.editText.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return updates.join(', ');
				}
			);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
	}

	private async updatePage(textId: number, numberOfPages: number, content: string)
	{
		const pages: Page[] = await databaseManager.executeQuery(
			queries.getAllPages,
			[textId]
		);

		const newNumberOfPages: number = (numberOfPages !== undefined) ? numberOfPages : pages.length;

		let newContent: string;
		if (content !== undefined)
		{
			newContent = content;
		}
		else
		{
			newContent = pages.map((page: Page) => page.content).join('');
		}

		const sentences: string[] = newContent.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
			.filter((sentence: string) => sentence !== '');
		const sentencesPerPage: number = Math.floor(sentences.length / newNumberOfPages);

		let firstPageIndex: number = 0;
		let lastPageIndex: number = sentencesPerPage + (sentences.length % newNumberOfPages > 0 ? 0 : -1);
		for (let i = 0; i < newNumberOfPages; i++)
		{
			// Do not trim the following string! Separators must be preserved in case the number of pages is changed
			const pageContent: string = sentences.slice(firstPageIndex, lastPageIndex+1).join('');
			if (i < pages.length)
			{
				await databaseManager.executeQuery(
					queries.editPage,
					[pageContent, textId, i+1]
				);
			}
			else
			{
				await databaseManager.executeQuery(
					queries.addPage,
					[textId, i+1, pageContent]
				);
			}

			firstPageIndex = lastPageIndex + 1;
			lastPageIndex = firstPageIndex
				+ sentencesPerPage
				+ ((i + 1) < sentences.length % numberOfPages ? 0 : -1);
		}
		for (let i = newNumberOfPages; i < pages.length; i++)
		{
			await databaseManager.executeQuery(
				queries.deletePage,
				[textId, (i+1).toString()]
			);
		}
	}
}

export { TextsController };
