import { Config } from "jest";

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['**/tests/**/*.test.ts'],
	transform: {
	  '^.+\\.ts$': 'ts-jest',
	},
	clearMocks: true,
	reporters: [['github-actions', {silent: false}], 'summary'],
};

export default config;