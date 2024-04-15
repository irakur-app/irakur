/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(
	{
		base: '/',
		plugins: [react()],
		server: {
			host: 'localhost',
			port: 5000,
			proxy: {
				'/api': {
					target: 'http://localhost:5000',
					changeOrigin: true,
				},
			},
		},
	}
);
