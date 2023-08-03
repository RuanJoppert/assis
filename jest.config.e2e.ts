import type { Config } from 'jest';
import base from './jest.config';

const config: Config = {
  ...base,

  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.integration.ts'],
  testRegex: '\\.steps\\.ts$',
};

export default config;
