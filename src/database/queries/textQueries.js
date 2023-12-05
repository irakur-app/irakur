const textQueries =
{
    getTexts: 'SELECT * FROM text WHERE language_id = ?',
    addText: 'INSERT INTO text (language_id, title, content, source_url) VALUES (?, ?, ?, ?)'
}

module.exports = textQueries;