const defaultConfig = require('../../jest.config');

module.exports = {
  ...defaultConfig,
  moduleNameMapper: {
    '\\.(css|less)$': '../../__mocks__/styleMock.js',
  },
  roots: ['<rootDir>'],
};
