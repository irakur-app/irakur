/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Collection, Text } from '@common/types';
import { databaseManager } from '../database/database-manager';
import { queries } from '../database/queries';

class CollectionsController
{
	addCollection(name: string): void
	{
		databaseManager.runQuery(
			queries.addCollection,
			{
				name,
			}
		);
	}

    addCollectionsInBatch(names: string[]): void
	{
		const valueList: string[] = [];
		for (const name of names)
		{
			valueList.push(
				`('${name}')`
			);
		}

		const dynamicQuery: string = queries.addCollectionsInBatch.replace(
			/\%DYNAMIC\%/,
			(): string => {
				return valueList.join(', ');
			}
		);

		databaseManager.runQuery(dynamicQuery);
	}

    addTextToCollection(textId: number, collectionName: string): void
    {
        const collection: Collection | null = databaseManager.getFirstRow(
            queries.findCollection,
            {
                name,
            }
        );

        let collectionId: number;

        if (!collection)
        {
            this.addCollection(collectionName);
            collectionId = databaseManager.getLastInsertId();
        }
        else
        {
            collectionId = collection.id;
        }

        databaseManager.runQuery(
            queries.addTextToCollection,
            {
                textId,
                collectionId,
            }
        );
    }

    addTextToCollectionsInBatch(textId: number, collectionNames: string[]): void
    {
		this.addCollectionsInBatch(collectionNames);

		databaseManager.runQuery(
			queries.deleteTextCollections,
			{
				textId
			}
		);

		const valueList: string[] = [];
		for (const name of collectionNames)
		{
			valueList.push(
				`((SELECT id AS collection_id FROM collection WHERE name = '${name}'), ${textId})`
			);
		}

		const dynamicQuery: string = queries.addTextToCollectionsInBatch.replace(
			/\%DYNAMIC\%/,
			(): string => {
				return valueList.join(', ');
			}
		);

		databaseManager.runQuery(dynamicQuery);
    }

    getAllCollections(): Collection[]
	{
		const collections: Collection[] = databaseManager.getAllRows(queries.getAllCollections);

		return collections;
	}

	getCollectionsOfText(textId: number) : Collection[]
	{
		const collections: Collection[] = databaseManager.getAllRows(
			queries.getCollectionsOfText,
			{
				textId
			}
		);

		return collections;
	}

    getTextsInCollection(collectionName: string): Text[]
    {
        const texts: Text[] = databaseManager.getAllRows(
            queries.getTextsInCollection,
            {
                collectionName,
            }
        );

        return texts;
    }
}

export { CollectionsController };
