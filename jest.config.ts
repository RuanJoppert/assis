import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'ts'],
  rootDir: '.',
  testRegex: ['\\.spec\\.ts$', '\\.step\\.ts$'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!**/*.spec.ts', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@modules/(.*)$': '<rootDir>/src/modules/$1',
    '@providers/(.*)$': '<rootDir>/src/application/providers/$1',
    '@app/(.*)$': '<rootDir>/src/application/$1',
    '@src/(.*)$': '<rootDir>/src/$1',
    '@tests/(.*)$': '<rootDir>/tests/$1',
  },
};

export default config;
