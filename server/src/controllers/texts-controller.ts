/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class TextsController
{
	async addText(req:Request, res:Response)
	{
		await databaseManager.executeQuery(queries.addText,
			[req.body.languageId, req.body.title, req.body.sourceUrl]
		);

		const sentences = req.body.content.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
			.filter((sentence:string) => sentence !== '');
		const sentencesPerPage = Math.floor(sentences.length / req.body.numberOfPages);

		const textId = (await databaseManager.getLastInsertId()).id;

		let firstPageIndex = 0;
		let lastPageIndex = sentencesPerPage + (sentences.length % req.body.numberOfPages > 0 ? 0 : -1);
		for (let i = 0; i < req.body.numberOfPages; i++)
		{
			const pageContent = sentences.slice(firstPageIndex, lastPageIndex+1).join('') // Do not trim! It will cause data loss
			await databaseManager.executeQuery(queries.addPage,
				[textId, i+1, pageContent]
			);

			firstPageIndex = lastPageIndex + 1;
			lastPageIndex = firstPageIndex + sentencesPerPage + ((i + 1) < sentences.length % req.body.numberOfPages ? 0 : -1);
		}
		
		res.redirect('/texts');
	}

	async getAllTexts(req:Request, res:Response)
	{
		const texts = await databaseManager.executeQuery(queries.getAllTexts,
			[req.body.languageId]
		);
		
		res.json({texts: texts});
	}

	async getText(req:Request, res:Response)
	{
		const text = await databaseManager.getFirstRow(queries.getText,
			[req.params.textId]
		)
		const numberOfPages = (await databaseManager.executeQuery(queries.getAllPages,
			[req.params.textId]
		)).length;

		console.log(text);

		res.json({text: text, numberOfPages: numberOfPages});
	}

	async deleteText(req:Request, res:Response)
	{
		const pages = await databaseManager.executeQuery(queries.getAllPages,
			[req.params.textId]
		);
		for (const page of pages)
		{
			await databaseManager.executeQuery(queries.deletePage,
				[req.params.textId, page.number]
			);
		}

		await databaseManager.executeQuery(queries.deleteText,
			[req.params.textId]
		)
		
		res.redirect('/texts');
	}

	async editText(req:Request, res:Response)
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (req.body.languageId)
		{
			const language = await databaseManager.getFirstRow(queries.getLanguage, [req.body.languageId]);
			if (!language)
			{
				res.status(400).send('Language does not exist');
				return;
			}
			updates.push('language_id = ?');
			queryParams.push(req.body.languageId);
		}
		if (req.body.title)
		{
			updates.push('title = ?');
			queryParams.push(req.body.title);
		}
		if (req.body.sourceUrl)
		{
			updates.push('source_url = ?');
			queryParams.push(req.body.sourceUrl);
		}
		if (req.body.numberOfPages)
		{
			const pages = await databaseManager.executeQuery(queries.getAllPages,
				[req.params.textId]
			);
			
			const content = pages.map((page:any) => page.content).join('');

			const sentences = content.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
				.filter((sentence:string) => sentence !== '');
			const sentencesPerPage = Math.floor(sentences.length / req.body.numberOfPages);

			let firstPageIndex = 0;
			let lastPageIndex = sentencesPerPage + (sentences.length % req.body.numberOfPages > 0 ? 0 : -1);
			for (let i = 0; i < req.body.numberOfPages; i++)
			{
				const pageContent = sentences.slice(firstPageIndex, lastPageIndex+1).join('') // Do not trim! It will cause data loss
				if(i < pages.length)
				{
					await databaseManager.executeQuery(queries.editPage,
						[pageContent, req.params.textId, i+1]
					);
				}
				else
				{
					await databaseManager.executeQuery(queries.addPage,
						[req.params.textId, i+1, pageContent]
					);
				}

				firstPageIndex = lastPageIndex + 1;
				lastPageIndex = firstPageIndex + sentencesPerPage + ((i + 1) < sentences.length % req.body.numberOfPages ? 0 : -1);
			}
			for (let i = req.body.numberOfPages; i < pages.length; i++)
			{
				await databaseManager.executeQuery(queries.deletePage,
					[req.params.textId, i+1]
				);
			}
		}

		if (updates.length > 0)
		{
			queryParams.push(req.params.textId);
			console.log(queryParams);

			const dynamicQuery = queries.editText.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});

			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
		
		res.redirect('/texts');
	}
}

export { TextsController };