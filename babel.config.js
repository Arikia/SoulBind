// babel.config.js
//
// Used only by Jest, and only to down-level the ESM-only .js files that
// solana-agent-kit's dependency tree pulls from node_modules (jest.config.js
// transforms all of node_modules, not just our own source, to reach them).
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }]],
};
