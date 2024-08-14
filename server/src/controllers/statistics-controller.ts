/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class StatisticsController
{
	async getWordsImprovedCount(languageId: number): Promise<{wordsImprovedCount: number}>
    {
        return {
            wordsImprovedCount: (await databaseManager.getFirstRow(
                queries.getWordsImprovedCount, [languageId]
            )).wordsImprovedCount
        };
    }
}

export { StatisticsController };
