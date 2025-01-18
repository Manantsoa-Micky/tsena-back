declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test';
			PORT: string;
			LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
			DATABASE_URL: string;
			JWT_SECRET: string;
			// Add other environment variables as needed
		}
	}
}

export {};