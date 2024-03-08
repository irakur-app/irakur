/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const textQueries =
{
    getTexts: 'SELECT * FROM text WHERE language_id = ?',
    getText: 'SELECT * FROM text WHERE id = ?',
    addText: 'INSERT INTO text (language_id, title, content, source_url) VALUES (?, ?, ?, ?)',
    deleteText: 'DELETE FROM text WHERE id = ?',
    editText: 'UPDATE text SET %DYNAMIC% WHERE id = ?',
}

export { textQueries };