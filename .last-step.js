module.exports = {
  sourceDirectory: 'src',
  targetDirectory: 'build',
  verbose: true,
  html: [
    // MSN log viewer
    {
      entries: [/^msn\/.*\.html$/]
		},
		// NewSMTH search client
		{
			entries: [/^newsmth\/.*\.html$/]
		}
  ],
  css: [
    // MSN log viewer
    {
      entries: [/^msn\/.*\.(less|css)$/],
      dest: 'msn/main.css',
      lessOptions: {}
    }
  ],
  javascript: [
    // MSN log viewer
    {
      entries: [
        { entry: 'msn/msn-chat-log-viewer.js', dest: 'msn/main.js' },
        { entry: 'msn/worker/parser-worker.js' }
      ],
      rollupOptions: {},
      babelOptions: {
        presets: ['es2015-rollup', 'stage-1']
      },
      uglifyJSOptions: {}
		},
		// NewSMTH search client
		{
			entries: [
				{ entry: 'newsmth/search-newsmth.user.js' }
			]
		}
  ]
};
