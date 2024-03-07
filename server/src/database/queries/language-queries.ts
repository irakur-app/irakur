/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const languageQueries =
{
    getLanguages: 'SELECT * FROM language',
    getLanguage: 'SELECT * FROM language WHERE id = ?',
    addLanguage: 'INSERT INTO language (name, dictionary_url, should_show_spaces) VALUES (?, ?, ?)',
    deleteLanguage: 'DELETE FROM language WHERE id = ?',
    editLanguage: 'UPDATE language SET name = ?, dictionary_url = ?, should_show_spaces = ? WHERE id = ?'
}

export { languageQueries }