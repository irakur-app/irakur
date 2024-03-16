/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Page, Word, ReducedWordData } from "@common/types";
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class PagesController
{
	async getAllPages(textId: number): Promise<Page[]>
	{
		const pages: Page[] = await databaseManager.executeQuery(queries.getAllPages,
			[textId]
		);

		return pages;
	}

	async getPage(textId: number, pageId: number): Promise<Page>
	{
		const page: Page = await databaseManager.getFirstRow(queries.getPage,
			[textId, pageId]
		);

		return page;
	}

	async editPage(textId: number, index: number, content: string, pageId: number): Promise<void>
	{
		const queryParams: any[] = [];
		const updates: string[] = [];

		if (content !== undefined)
		{
			updates.push('content = ?');
			queryParams.push(content);
		}
		
		if (updates.length > 0)
		{
			queryParams.push(textId);
			queryParams.push(pageId);

			const dynamicQuery: string = queries.editPage.replace(/\%DYNAMIC\%/, (): string => {
				return updates.join(', ');
			});

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
	}

	async getWords(textId: number, pageId: number): Promise<ReducedWordData[]>
	{
		const page: Page = await databaseManager.getFirstRow(queries.getPage,
			[textId, pageId]
		);

		const languageId: number = (await databaseManager.getFirstRow(queries.getText,
			[page.text_id]
		)).language_id;

		const items: string[] = page.content.split(/([ \r\n"':;,.¿?¡!()\-=。、！？：；「」『』（）…＝・’“”—\d])/u)
			.filter((sentence: string) => sentence !== '');
		const wordData: ReducedWordData[] = [];
		for (const word of items)
		{
			if (!this.isWord(word))
			{
				wordData.push({content: word, type: 'punctuation'});
				continue;
			}
			const wordRow: Word = await databaseManager.getFirstRow(queries.findWord,
				[word, languageId]
			);
			if (!wordRow)
			{
				wordData.push({content: word, status: 0, type: 'word'});
			}
			else
			{
				wordData.push({content: word, status: wordRow.status, type: 'word'});
			}
		}

		return wordData;
	}
	
	isWord(item: string): boolean
	{
		return (item.match(/[ :;,.¿?¡!()\[\]{}\s'"\-=。、！？：；「」『』（）…＝・’“”—\d]/u) === null);
	}
}

export { PagesController };