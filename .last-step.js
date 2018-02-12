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
          presets: ['env', 'react']
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
