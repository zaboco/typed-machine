module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/examples'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageReporters: ['html', 'text-summary'],
  verbose: false,
};
