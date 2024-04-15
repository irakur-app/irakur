# Code guidelines

* [Indentation](#indentation)
* [Naming Conventions](#naming-conventions)
* [Indenting and Whitespaces](#indenting-and-whitespaces)
* [Line breaks](#line-breaks)
* [Declarations](#declarations)
* [Modules](#modules)

### Introduction

https://www.ietf.org/rfc/rfc2119.txt

### Naming Conventions

* Names MUST be descriptive, and SHOULD NOT be abbreviations, except when such abbreviations are conventional (such as `req` instead of `request` when using Express' API).
* Variable names MAY be a single character long for counters in a `for` loop.
* The following casing conventions apply:
	* Variables, functions and objects MUST use _camelCase_ casing style.
	* Types, classes and JSX elements MUST use _PascalCase_.
	* Files MUST use _kebab-case_.
	* SQL columns MUST use _snake_case_.
* Acronyms MUST use _camelCase_.
* Booleans SHOULD have a third-person verb as a prefix.
* Pure Typescript files MUST have a `.ts` extension, while Typescript files with JSX elements MUST have a `.tsx` extension.

```TypeScript
// Wrong
const rtr = express.Router();
async GetAllTexts(): Promise<Text[]> { }
const dictionaryURL: string = ...;
const showSpaces: boolean = ...;

// Correct
const router = express.Router();
async getAllTexts(): Promise<Text[]> { }
const dictionaryUrl: string = ...;
const shouldShowSpaces: boolean = ...;
```

### Indenting and punctuation

* A single tab MUST be used to indent once (no spaces).
* There SHOULD NOT be two consecutive whitespaces.
* A space MUST go between keywords and parentheses, after colons and before commas.
* Binary operators MUST be surrounded by spaces.
* When wrapping a line, the contents of the new line MUST be indented.
* In a function call, all parameters MUST be at the same indentation level.
* Closing brackets MUST be at the same indentation level as the opening bracket.
* The contents of a single line object MUST be surrounded by spaces.
* Multi-line objects MUST use a trailing comma.

```Typescript
// Wrong
if(name!==undefined)
{
   ...
}

const enteredText: string | null = prompt("Do you really want to delete language '" + language.name +
"' (ID: " + language.id + ")?\n" +
"*It will permanently delete all texts and all words associated with it*.\nType 'DELETE' to confirm.");

import {Home} from './pages/home';

// Correct
if (name !== undefined)
{
	...
}

const enteredText: string | null = prompt(
	"Do you really want to delete language '" + language.name
		+ "' (ID: " + language.id + ")?\n"
		+ "*It will permanently delete all texts and all words associated with it*.\n"
		+ "Type 'DELETE' to confirm."
);

import { Home } from './pages/home';
```

### Line breaks

* Opening braces MUST be placed on a new line when opening a block, except when the block is the body of a lambda function.
* Braces MUST be used even when there is only one statement in the block.
* Lines MUST be wrapped at 120 characters.
* When wrapping a function call or a function declaration, if the opening and closing parentheses are on separate lines, all parameters MUST be on separate lines and the first parameter MUST be on a new line.
* When wrapping a line, commas MUST be placed at the end of wrapped lines, and operators MUST be at the beginning of the new lines.
* There MUST NOT be a line break immediately after an equal sign.

```Typescript
// Wrong
if (!response.ok) {
	...
}

if (!response.ok)
	...

await databaseManager.executeQuery(queries.deleteWord,
	[wordId]
);

// Correct 
if (!response.ok)
{
	...
}

await databaseManager.executeQuery(
	queries.deleteWord,
	[wordId]
);
```

### Declarations

* A variable MUST be declared as late as possible.
* Variables MUST be declared as `const` whenever possible. Declaring variables as `var` SHOULD be avoided.
* Types SHOULD be explicitly declared, unless they are obviously inferred.

```Typescript
// Wrong
var languageId;
...
languageId = ...;

// Correct
...
const languageId = ...
```

### Modules

* Default exports MUST be avoided.
* ES6 modules MUST be used.
* Exports MUST go at the end of the file.

```TSX
// Wrong
module.exports = { ... };

export default (): JSX.Element => {
	return (
		<p>Loading...</p>
	);
};


// Correct
const Loading = (): JSX.Element => {
	return (
		<p>Loading...</p>
	);
};
export { Loading };
```


* In order to be able to import most comfortably, when creating a front-end component or page, a new _index.ts_ file SHOULD be created in the same folder as the implementation file. This file MUST export `*` from the implementation file.

```TSX
// components/loading/loading.tsx
...
export { Loading };

// components/loading/index.ts
export * from "./loading";

// pages/home/home.tsx
import { Loading } from "@src/components/loading";
...
if (!languages)
{
	return <Loading />;
}
```
