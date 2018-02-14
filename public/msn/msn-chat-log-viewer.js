'use strict';

(function () {
	'use strict';

	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
			(i[r].q = i[r].q || []).push(arguments);
		}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
	})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
	ga('create', 'UA-93959709-1', 'auto');
	ga('send', 'pageview');

	/*
 (function(d,n,u,s,f){s=d.createElement(n),f=d.getElementsByTagName(n)[0],s.src=u;
 f.parentNode.insertBefore(s,f)})(document,'script',
 '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
 (adsbygoogle = window.adsbygoogle || []).push({
 google_ad_client: "ca-pub-1081778625571362",
 enable_page_level_ads: true});
 */

	window.addEventListener('load', function () {
		var inputXml = document.getElementById('chat-logs-xml');
		var inputFile = document.getElementById('chat-logs-file');
		var output = document.getElementById('chat-logs');
		var spinner = document.getElementById('loading-spinner');

		var parserWorker = void 0;

		var writeOutput = function writeOutput(s) {
			if (s) {
				var batch = document.createElement('div');
				batch.innerHTML = s;
				output.appendChild(batch);
			}
		};

		var toggleSpinner = function toggleSpinner(on) {
			return spinner[!on ? 'setAttribute' : 'removeAttribute']('hidden', '');
		};

		var parseLogs = function parseLogs(logsContent) {
			output.innerHTML = '';
			output.classList.remove('parse-completed');
			toggleSpinner(true);
			if (parserWorker) parserWorker.terminate();
			parserWorker = new Worker('worker/parser-worker.js');
			parserWorker.onmessage = function (e) {
				writeOutput(e.data.html);
				toggleSpinner(!e.data.lastBatch);
				output.classList.add('parse-completed');
			};
			parserWorker.postMessage(logsContent);
		};

		inputXml.addEventListener('change', function (e) {
			return parseLogs(inputXml.value);
		}, false);
		inputFile.addEventListener('change', function (e) {
			var files = e.target.files;
			if (files.length) {
				var reader = new FileReader();
				reader.onload = function (evt) {
					return parseLogs(evt.target.result);
				};
				reader.readAsText(files[0]);
			}
		}, false);
	}, false);
})();