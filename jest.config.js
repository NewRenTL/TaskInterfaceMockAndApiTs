module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__test__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
  };
  