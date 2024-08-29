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
	getPagesByText(textId: number): Page[]
	{
		const pages: Page[] = databaseManager.getAllRows(
			queries.getPagesByText,
			{
				textId,
			}
		);

		return pages;
	}

	getPage(textId: number, pagePosition: number): Page
	{
		const page: Page = databaseManager.getFirstRow(
			queries.getPage,
			{
				textId,
				pagePosition,
			}
		);

		return page;
	}

	getWords(textId: number, pagePosition: number): ReducedWordData[]
	{
		const page: Page = databaseManager.getFirstRow(
			queries.getPage,
			{
				textId,
				pagePosition,
			}
		);

		const languageId: number = databaseManager.getFirstRow(
			queries.getText,
			{
				textId,
			}
		).languageId;

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
		
		const wordData: ReducedWordData[] = databaseManager.getAllRows(
			dynamicQuery,
			{
				languageId,
			}
		);

		for (let i = 0; i < wordData.length; i++)
		{
			if (wordData[i].potentialMultiword)
			{
				const potentialMultiwords: Word[] = databaseManager.getAllRows(
					queries.getPotentialMultiwords,
					{
						content: wordData[i].content,
						languageId,
					}
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
}

export { PagesController };

