module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',
  // roots: [
  //   "<rootDir>/tests"
  // ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
