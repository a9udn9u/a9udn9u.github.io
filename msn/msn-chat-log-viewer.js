window.addEventListener('load', () => {
	const inputXml = document.getElementById('chat-logs-xml');
	const inputFile = document.getElementById('chat-logs-file');
	const output = document.getElementById('chat-logs');
	const spinner = document.getElementById('loading-spinner');

	let parserWorker;

	let writeOutput = s => {
		if (s) {
			let batch = document.createElement('div');
			batch.innerHTML = s;
			output.appendChild(batch);
		}
	}

	let toggleSpinner = on => spinner[!on ? 'setAttribute' : 'removeAttribute']('hidden', '');

	let parseLogs = logsContent => {
		output.innerHTML = '';
		output.classList.remove('parse-completed');
		toggleSpinner(true);
    if (parserWorker) parserWorker.terminate();
    parserWorker = new Worker('worker/parser-worker.js');
    parserWorker.onmessage = (e) => {
      writeOutput(e.data.html);
      toggleSpinner(!e.data.lastBatch);
			output.classList.add('parse-completed');
    }
		parserWorker.postMessage(logsContent);
	}

	inputXml.addEventListener('change', e => parseLogs(inputXml.value), false);
	inputFile.addEventListener('change', e => {
		let files = e.target.files;
		if (files.length) {
			let reader = new FileReader();
			reader.onload = evt => parseLogs(evt.target.result);
			reader.readAsText(files[0]);
		}
	}, false);
}, false);