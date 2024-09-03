/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

const queries: Record<string, string> = {
	//#region Create tables
	createConfigurationTable: `CREATE TABLE IF NOT EXISTS configuration (
		key TEXT NOT NULL,
		value TEXT,
		CONSTRAINT pk__configuration__key PRIMARY KEY (key)
	)`,
	createLanguageTable: `CREATE TABLE IF NOT EXISTS language (
		id INTEGER,
		name TEXT NOT NULL,
		dictionary_url TEXT,
		should_show_spaces INTEGER NOT NULL DEFAULT 1,
		alphabet TEXT NOT NULL,
		sentence_delimiters TEXT NOT NULL,
		whitespaces TEXT NOT NULL,
		intraword_punctuation TEXT NOT NULL,
		template_code TEXT NOT NULL,
		script_name TEXT NOT NULL,
		CONSTRAINT pk__language__id PRIMARY KEY (id),
		CONSTRAINT uq__language__name UNIQUE (name)
	)`,
	createTextTable: `CREATE TABLE IF NOT EXISTS text (
		id INTEGER,
		language_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		source_url TEXT,
		time_opened INTEGER,
		time_finished INTEGER,
		progress REAL NOT NULL DEFAULT 0,
		CONSTRAINT pk__text__id PRIMARY KEY (id),
		CONSTRAINT fk__text__language_id FOREIGN KEY (language_id) REFERENCES language (id),
		CONSTRAINT uq__text__language_id__title UNIQUE (language_id, title)
	)`,
	createPageTable: `CREATE TABLE IF NOT EXISTS page (
		id INTEGER,
		text_id INTEGER,
		position INTEGER,
		content TEXT NOT NULL,
		CONSTRAINT pk__page__id PRIMARY KEY (id),
		CONSTRAINT fk__page__text_id FOREIGN KEY (text_id) REFERENCES text (id)
		CONSTRAINT uq__page__text_id__position UNIQUE (text_id, position)
	)`,
	createWordTable: `CREATE TABLE IF NOT EXISTS word (
		id INTEGER,
		language_id INTEGER NOT NULL,
		content TEXT NOT NULL,
		status INTEGER NOT NULL DEFAULT 0,
		notes TEXT,
		time_added INTEGER NOT NULL,
		time_updated INTEGER NOT NULL,
		token_count INTEGER NOT NULL DEFAULT 1,
		CONSTRAINT pk__word__id PRIMARY KEY (id),
		CONSTRAINT fk__word__language_id FOREIGN KEY (language_id) REFERENCES language (id),
		CONSTRAINT uq__word__language_id__content UNIQUE (language_id, content)
	)`,
	createEntryTable: `CREATE TABLE IF NOT EXISTS entry (
		id INTEGER,
		word_id INTEGER NOT NULL,
		position INTEGER NOT NULL,
		meaning TEXT NOT NULL,
		reading TEXT NOT NULL,
		CONSTRAINT pk__entry__id PRIMARY KEY (id),
		CONSTRAINT fk__entry__word_id FOREIGN KEY (word_id) REFERENCES word (id),
		CONSTRAINT uq__entry__word_id__position UNIQUE (word_id, position)
	)`,
	createStatusLogTable: `CREATE TABLE IF NOT EXISTS status_log (
		id INTEGER,
		word_id INTEGER NOT NULL,
		status INTEGER NOT NULL,
		time_updated INTEGER NOT NULL,
		CONSTRAINT pk__status_log__id PRIMARY KEY (id),
		CONSTRAINT fk__status_log__word_id FOREIGN KEY (word_id) REFERENCES word (id)
		CONSTRAINT uq__status_log__word_id__time_updated UNIQUE (word_id, time_updated)
	)`,
	//#endregion

	//#region Create indexes
	createTextLanguageIdTitleIndex: `CREATE INDEX IF NOT EXISTS
		ix__text__language_id__title ON text (
			language_id, title
		)`,
	createWordLowerContentLanguageIdIndex: `CREATE INDEX IF NOT EXISTS
		ix__word__lower_content__language_id ON word (
			LOWER(content), language_id
		)`,
	createWordLanguageIdTokenCountContentIndex: `CREATE INDEX IF NOT EXISTS
		ix__word__language_id__token_count__content ON word (
			language_id, token_count, content
		)`,
	//#endregion

	//#region Create triggers
	createInsertStatusLogAfterInsertWordTrigger: `CREATE TRIGGER IF NOT EXISTS
		tr__insert__status_log__after__insert__word
		AFTER INSERT ON word
		BEGIN
			INSERT INTO status_log (
				word_id,
				status,
				time_updated
			)
			VALUES (
				NEW.id,
				NEW.status,
				NEW.time_updated
			);
		END`,
	createInsertStatusLogAfterUpdateWordTrigger: `CREATE TRIGGER IF NOT EXISTS
		tr__insert__status_log__after__update__word
		AFTER UPDATE ON word
		WHEN OLD.status != NEW.status
		BEGIN
			INSERT INTO status_log (
				word_id,
				status,
				time_updated
			)
			VALUES (
				NEW.id,
				NEW.status,
				NEW.time_updated
			);
		END`,
	createDeleteStatusLogAfterDeleteWordTrigger: `CREATE TRIGGER IF NOT EXISTS
		tr__delete__status_log__after__delete__word
		AFTER DELETE ON word
		BEGIN
			DELETE FROM status_log
			WHERE word_id = OLD.id;
		END`,
	//#endregion

	//#region Language
	getAllLanguages: `SELECT
			id,
			name,
			dictionary_url AS dictionaryUrl,
			should_show_spaces AS shouldShowSpaces,
			alphabet,
			sentence_delimiters AS sentenceDelimiters,
			whitespaces,
			intraword_punctuation AS intrawordPunctuation,
			template_code AS templateCode,
			script_name AS scriptName
		FROM language`,
	getLanguage: `SELECT
			id,
			name,
			dictionary_url AS dictionaryUrl,
			should_show_spaces AS shouldShowSpaces,
			alphabet,
			sentence_delimiters AS sentenceDelimiters,
			whitespaces,
			intraword_punctuation AS intrawordPunctuation,
			template_code AS templateCode,
			script_name AS scriptName
		FROM language WHERE id = :languageId`,
	addLanguage: `INSERT INTO language (
			name,
			dictionary_url,
			should_show_spaces,
			alphabet,
			sentence_delimiters,
			whitespaces,
			intraword_punctuation,
			template_code,
			script_name
		)
		VALUES (:name, :dictionaryUrl, :shouldShowSpaces, :alphabet, :sentenceDelimiters, :whitespaces, :intrawordPunctuation, :templateCode, :scriptName)`,
	deleteLanguage: `DELETE FROM language WHERE id = :languageId`,
	editLanguage: `UPDATE language SET %DYNAMIC% WHERE id = :languageId`,
	//#endregion

	//#region Text
	getAllTexts: `SELECT
			id,
			language_id AS languageId,
			title,
			source_url AS sourceUrl,
			time_opened AS timeOpened,
			time_finished AS timeFinished,
			progress
		FROM text`,
	getTextsByLanguage: `SELECT
			id,
			language_id AS languageId,
			title,
			source_url AS sourceUrl,
			time_opened AS timeOpened,
			time_finished AS timeFinished,
			progress
		FROM text
		WHERE language_id = :languageId`,
	getText: `SELECT
			id,
			language_id AS languageId,
			title,
			source_url AS sourceUrl,
			time_opened AS timeOpened,
			time_finished AS timeFinished,
			progress
		FROM text
		WHERE id = :textId`,
	addText: `INSERT INTO text (
			language_id,
			title,
			source_url
		)
		VALUES (:languageId, :title, :sourceUrl)`,
	deleteText: `DELETE FROM text WHERE id = :textId`,
	editText: `UPDATE text SET %DYNAMIC% WHERE id = :textId`,
	//#endregion

	//#region Page
	getPagesByText: `SELECT
			text_id AS textId,
			position,
			content
		FROM page
		WHERE text_id = :textId`,
	getPage: `SELECT
			text_id AS textId,
			position,
			content
		FROM page
		WHERE text_id = :textId AND position = :pagePosition`,
	addPage: `INSERT INTO page (
			text_id,
			position,
			content
		)
		VALUES (:textId, :position, :content)`,
	addPagesInBatch: `INSERT INTO page (
			text_id,
			position,
			content
		)
		VALUES %DYNAMIC%`,
	deletePage: `DELETE FROM page WHERE text_id = :textId AND position = :pagePosition`,
	deletePagesInBatch: `DELETE FROM page WHERE text_id = :textId AND position >= :pagePosition`,
	deletePagesByText: `DELETE FROM page WHERE text_id = :textId`,
	editPage: `UPDATE page SET content = :content WHERE text_id = :textId AND position = :pagePosition`,
	//#endregion

	//#region Word
	getWord: `SELECT
			id,
			language_id AS languageId,
			content,
			status,
			notes,
			time_added AS timeAdded,
			time_updated AS timeUpdated,
			token_count AS tokenCount
		FROM word
		WHERE id = :wordId`,
	findWord: `SELECT
			id,
			language_id AS languageId,
			content,
			status,
			notes,
			time_added AS timeAdded,
			time_updated AS timeUpdated,
			token_count AS tokenCount
		FROM word
		WHERE LOWER(content) = LOWER(:content) AND language_id = :languageId`,
	findWordsInBatch: `WITH input_words(content) AS (VALUES %DYNAMIC%)
		SELECT
			input_words.content AS content,
			status,
			CASE 
				WHEN input_words.content REGEXP :alphabet
					THEN 'word'
				WHEN input_words.content REGEXP :whitespaces
					THEN 'whitespace'
				ELSE 'punctuation'
			END AS type,
			EXISTS (
				SELECT token_count
				FROM word
				WHERE word.content LIKE (input_words.content || '%') AND word.language_id = :languageId AND word.token_count > 1
			) AS potentialMultiword
		FROM input_words
		LEFT JOIN word ON LOWER(input_words.content) = LOWER(word.content) AND word.language_id = :languageId`,
	addWord: `INSERT INTO word (
			language_id,
			content,
			status,
			notes,
			time_added,
			time_updated,
			token_count
		)
		VALUES (:languageId, :content, :status, :notes, :timeAdded, :timeUpdated, :tokenCount)`,
	addWordsInBatch: `INSERT INTO word (
			language_id,
			content,
			status,
			notes,
			time_added,
			time_updated,
			token_count
		)
		VALUES %DYNAMIC%`,
	deleteWord: `DELETE FROM word WHERE id = :wordId`,
	editWord: `UPDATE word SET %DYNAMIC% WHERE id = :wordId`,
	getPotentialMultiwords: `SELECT
			id,
			language_id AS languageId,
			content,
			status,
			notes,
			time_added AS timeAdded,
			time_updated AS timeUpdated,
			token_count AS tokenCount
		FROM word
		WHERE content LIKE (:content || '%')
			AND language_id = :languageId
			AND token_count > 1`,
	//#endregion

	//#region Entry
	getEntriesByWord: `SELECT
			meaning,
			reading
		FROM entry
		WHERE word_id = :wordId
		ORDER BY position ASC`,
	addEntry: `INSERT INTO entry (
			word_id,
			position,
			meaning,
			reading
		)
		VALUES (:wordId, :entryPosition, :meaning, :reading)`,
	addEntriesInBatch: `INSERT INTO entry (
			word_id,
			position,
			meaning,
			reading
		)
		VALUES %DYNAMIC%`,
	deleteEntriesByWord: `DELETE FROM entry WHERE word_id = :wordId`,
	//#endregion

	//#region Status Log
	getWordsImprovedCount: `WITH first_status_of_day AS (
			SELECT
				word_id,
				status AS first_status,
				MIN(time_updated) AS first_time_updated
			FROM status_log
			WHERE time_updated >= strftime('%s', 'now') - 86400
			GROUP BY word_id
		),
		last_status_of_day AS (
			SELECT
				word_id,
				status AS last_status,
				MAX(time_updated) AS last_time_updated
			FROM status_log
			WHERE time_updated >= strftime('%s', 'now') - 86400
			GROUP BY word_id
		)
		SELECT
			COUNT(*) AS wordsImprovedCount
		FROM first_status_of_day fs
		JOIN last_status_of_day ls
		ON fs.word_id = ls.word_id
		JOIN word
		ON word.id = ls.word_id
		WHERE last_status > first_status
			AND word.language_id = :languageId`,
	//#endregion

	//#region Utils
	getLastInsertId: `SELECT last_insert_rowid() AS id`,
	//#endregion
};

export { queries };
