export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['**/tests/**/*.test.ts'],
	transform: {
	  '^.+\\.ts$': 'ts-jest',
	},
	clearMocks: true,
};