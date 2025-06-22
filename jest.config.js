/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    // gjør at .ts/.tsx blir kjørt riktig
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    // Last inn miljøvariabler fra .env filer
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
  