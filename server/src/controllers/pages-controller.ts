/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Page, ReducedWordData, Word } from "@common/types";
import { tokenizeString } from "../../../common/utils";
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class PagesController
{
	async getPagesByText(textId: number): Promise<Page[]>
	{
		const pages: Page[] = await databaseManager.getAllRows(
			queries.getPagesByText,
			[textId]
		);

		return pages;
	}

	async getPage(textId: number, pagePosition: number): Promise<Page>
	{
		const page: Page = await databaseManager.getFirstRow(
			queries.getPage,
			[textId, pagePosition]
		);

		return page;
	}

	async editPage(textId: number, index: number, content: string, pagePosition: number): Promise<void>
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
			queryParams.push(pagePosition);

			const dynamicQuery: string = queries.editPage.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return updates.join(', ');
				}
			);

			await databaseManager.runQuery(dynamicQuery, queryParams);
		}
	}

	async getWords(textId: number, pagePosition: number): Promise<ReducedWordData[]>
	{
		const page: Page = await databaseManager.getFirstRow(
			queries.getPage,
			[textId, pagePosition]
		);

		const languageId: number = (await databaseManager.getFirstRow(
			queries.getText,
			[page.textId]
		)).languageId;

		const tokens: string[] = tokenizeString(page.content);
		
		const dynamicQuery: string = queries.findWordsInBatch.replace(
			/\%DYNAMIC\%/,
			(): string => {
				return tokens.map(
					(token: string): string => {
						return `('${token.replace(/'/g, "''")}')`;
					}
				).join(', ');
			}
		);
		
		const wordData: ReducedWordData[] = await databaseManager.getAllRows(
			dynamicQuery,
			[languageId, languageId]
		);

		for (let i = 0; i < wordData.length; i++)
		{
			if (wordData[i].potentialMultiword)
			{
				const potentialMultiwords: Word[] = await databaseManager.getAllRows(
					queries.getPotentialMultiwords,
					[wordData[i].content, languageId]
				);

				let multiword: Word | null = null;
				let tokenCount: number | null = null;
				let tokens: ReducedWordData[] | null = null;

				for (const potentialMultiword of potentialMultiwords)
				{
					tokenCount = potentialMultiword.tokenCount;

					tokens = wordData.slice(i, i + tokenCount);
					const tokensContent: string = tokens.map((token: ReducedWordData): string => {
						return token.content;
					}).join('');

					if (tokensContent === potentialMultiword.content)
					{
						multiword = potentialMultiword;
						break;
					}
				}

				if (multiword)
				{
					wordData.splice(i, multiword.tokenCount, {
						content: multiword.content,
						status: multiword.status,
						type: "multiword",
						tokens: tokens!,
						potentialMultiword: undefined,
						index: -1
					});

					i += multiword.tokenCount - 1;
				}
			}

			wordData[i].potentialMultiword = undefined;
		}

		this.addIndexesToWordData(wordData, 0);

		return wordData;
	}

	addIndexesToWordData(wordData: ReducedWordData[], startIndex: number): void
	{
		for (let i = 0; i < wordData.length; i++)
		{
			wordData[i].index = i+startIndex;
			if (wordData[i].type === "multiword")
			{
				this.addIndexesToWordData(wordData[i].tokens!, wordData[i].index+1);
				startIndex += wordData[i].tokens!.length;
			}
		}
	}
	
	isWord(token: string): boolean
	{
		return (token.match(/[ :;,.¿?¡!()\[\]{}\s'"\-=。、！？：；「」『』（）…＝・’“”—\d]/u) === null);
	}
}

export { PagesController };

