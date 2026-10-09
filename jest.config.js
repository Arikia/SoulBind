/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    // Our own TypeScript, via ts-jest (type-aware).
    '^.+\\.tsx?$': 'ts-jest',
    // @solana/web3.js pulls in rpc-websockets, which bundles an ESM-only
    // build of "uuid" that Jest can't parse by default. babel-jest
    // down-levels it to CommonJS.
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(rpc-websockets|uuid)/)'],
};
