# Irakur
### Learn languages through immersion

**Irakur** is an free and open-source language learning application. It focuses on making the [extensive reading](https://en.wikipedia.org/wiki/Extensive_reading) methodology available for _any_ written language. 

![Screenshot of the main app view](https://irakur.com/images/background.jpg)

## Overview

Irakur is a free and open-source application focused on enabling language learners to learn _any_ written language through extensive reading.

It is built with a local-first approach, which means all data is stored on the user's device and is accessible without Internet connection.

Irakur prioritizes essential features that enhance the reading experience. It is not an all-in umbrella app to study languages. For example, whilst we believe flashcards are a valid language-learning method, other solutions such as [Anki](https://apps.ankiweb.net/) will more than likely do the job better than Irakur. Instead of trying to replicate their functionalities, Irakur will prioritize creating bridges between these different apps (e.g. by enabling the user to export Irakur vocabulary to an Anki deck).

It will initially be distributed as a desktop application using [Electron](https://www.electronjs.org/).

## Features

- **Assisted Reading**: Displays definitions when clicking on words within the text.
- **Progress Tracking**: Color coding to represent the user's familiarity with each word.
- **Language Agnosticism**: Any language can be configured to be learned by the user. A plugin system will be available for further personalization in case specific languages need it (for example, for word parsing in spaceless languages such as Japanese).
- **Offline Functionality**: Irakur runs locally without an internet connection. The user will have the ability to synchronize their data accross devices.
- **Open-Source and Free**: Released under the AGPL-3.0 license with a proxy clause, check [#License](#License).
- **Cross-Platform**: It is developed with web technologies so that builds are available for different platforms in the future.
- **Multiwords**: Supports expressions consisting of multiple words, such as idioms and fixed phrases.

## Installation

The application hasn't been released yet, so only a developer installation method is offered.

1. Clone the repository:
```bash
git clone https://github.com/irakur-app/irakur.git
```

2. Navigate to the project directory:

```bash
cd irakur
```

3. Install dependencies:

```bash
npm install && (cd client && npm install) && (cd server && npm install)
```

4. Run the application:

```bash
npm run dev:app
```

## License

Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh) <anderaginaga2@gmail.com>

This program is free software: you can redistribute it and/or modify it under the terms of version 3 of the GNU Affero General Public License as published by the Free Software Foundation.

In accordance with the provisions of Article 14 of the GNU Affero General Public License, Ander Aginaga San Sebastián is designated as the proxy for determining which future versions of the GNU Affero General Public License may be applied to this program.

You may choose to follow the terms and conditions of version 3 of the GNU Affero General Public License, or, at your option, any later version accepted by the designated proxy.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program in the file named 'license-agpl-3.0'. If not, see <https://www.gnu.org/licenses/>.
