/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

class PluginError extends Error
{
    constructor(moduleId: string, errorMessage: string) {
        super("Plugin module " + moduleId + " threw the following error: " + errorMessage);

        Object.setPrototypeOf(this, PluginError.prototype);
    }
}

export { PluginError };
