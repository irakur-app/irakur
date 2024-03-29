/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class PagesController
{
	async getAllPages(textId: number)
	{
		const pages = await databaseManager.executeQuery(queries.getAllPages,
			[textId]
		);

		return pages;
	}

	async getPage(textId: number, pageId: number)
	{
		const page = databaseManager.getFirstRow(queries.getPage,
			[textId, pageId]
		);

		return page;
	}

	async editPage(textId: number, index: number, content: string, pageId: number)
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
			console.log(queryParams);

			const dynamicQuery = queries.editPage.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});

			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}

		return true;
	}

	async getWords(textId: number, pageId: number)
	{
		const page = await databaseManager.getFirstRow(queries.getPage,
			[textId, pageId]
		);

		const languageId = (await databaseManager.getFirstRow(queries.getText,
			[page.text_id]
		)).language_id;

		const items = page.content.split(/([ \r\n"':;,.¿?¡!()\-=。、！？：；「」『』（）…＝・’“”—\d])/u)
			.filter((sentence:string) => sentence !== '');
		const wordData = [];
		for (const word of items)
		{
			if (!this.isWord(word))
			{
				wordData.push({content: word, type: 'punctuation'});
				continue;
			}
			const wordRow = await databaseManager.getFirstRow(queries.findWord,
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
	isWord(item:string)
	{
		return (item.match(/[ :;,.¿?¡!()\[\]{}\s'"\-=。、！？：；「」『』（）…＝・’“”—\d]/u) === null);
	}
}

export { PagesController };