const { CopyProcessor } = require('last-step/dist/processors/copy');
const { LESSProcessor } = require('last-step/dist/processors/less');
const { CleanCSSProcessor } = require('last-step/dist/processors/clean-css');
const { RollupJSProcessor } = require('last-step/dist/processors/rollupjs');

module.exports = {
  sourceDir: 'src',
  targetDir: 'public',

  rules: [
    {
      sources: [/^cards\/.*\.js/],
      processors: [
        new RollupJSProcessor({
          babel: {
            presets: ['react', ['env', { modules: false }]],
            plugins: ['transform-class-properties', 'external-helpers']
          }
        })
      ]
    },
    {
      sources: [/^msn\/.*\.(less|css)$/],
      processors: [
        new LESSProcessor(),
        new CleanCSSProcessor()
      ]
    },
    {
      sources: [/^newsmth\/.*/],
      processors: [
        new CopyProcessor()
      ]
    }
  ]
};
