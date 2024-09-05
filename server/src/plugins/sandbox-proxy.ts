/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

const sandboxProxy = (target: any) => {
	const proxy = new Proxy(
		target,
		{
			get(target: any, property: string, receiver: any): any
			{
				if (property in target)
				{
					return Reflect.get(target, property, receiver);
				}
				else
				{
					throw new Error('Property ' + property + ' not found');
				}
			},
			set(target: any, property: string, value: any, receiver: any): any
			{
				throw new Error('Setting properties is not allowed');
			},
		}
	);

	return proxy;
};

export { sandboxProxy };
