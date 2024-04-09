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
					changeOrigin: true
				}
			}
		}
	}
);
