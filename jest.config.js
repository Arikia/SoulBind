/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    // Our own TypeScript, via ts-jest (type-aware).
    '^.+\\.tsx?$': 'ts-jest',
    // solana-agent-kit's dependency tree pulls in several ESM-only .js
    // packages (rpc-websockets' bundled uuid, @3land/listings-sdk's
    // node-fetch, etc.) that Jest can't parse by default. babel-jest
    // down-levels those to CommonJS.
    '^.+\\.jsx?$': 'babel-jest',
  },
  // Only un-ignore the specific packages that ship ESM-only builds, rather
  // than transforming all of node_modules (slow, and breaks at least one
  // unrelated WASM package that doesn't tolerate being re-transformed).
  transformIgnorePatterns: [
    'node_modules/(?!(rpc-websockets|uuid|node-fetch|fetch-blob|formdata-polyfill|data-uri-to-buffer|@3land)/)',
  ],
};
