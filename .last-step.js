const { CopyProcessor } = require('~/processors/copy');
const { BabelProcessor } = require('~/processors/babel');

module.exports = {
  sourceDir: 'src',
  targetDir: 'build',

  rules: [
    {
      sources: [/^cards\/.*\.js/],
      processors: [
        new BabelProcessor({
          presets: ['react', 'env'],
          plugins: ['transform-class-properties']
        })
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
