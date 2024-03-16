type Language = {
	id: number; 
	name: string; 
	should_show_spaces: number;
	dictionary_url: string; 
}

type Text = {
	id: number; 
	language_id: number; 
	title: string; 
	source_url: string; 
}

type Page = {
	text_id: number; 
	number: number; 
	content: string; 
}

type ReducedWordData = {
	content: string;
	status?: number;
	type: string;
}

type Entry = {
	meaning: string,
	reading: string
}

type Word = {
	id: number;
	language_id: number;
	content: string;
	status: number;
	entries: Entry[];
	notes: string;
	datetime_added: string;
	datetime_updated: string;
}

export type { Language, Text, Page, ReducedWordData, Entry, Word };