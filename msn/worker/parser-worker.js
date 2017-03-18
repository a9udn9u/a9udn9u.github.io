importScripts('tinyxmlsax.js');

function SAXEventHandler(batchSize) {
	this.characterData = "";
	this.currentMessage;
	this.currentUserType;
	this.currentText;
	this.firstUser;
	this.lastSession = -1;
	this.chatLogs = [];

	this.sendBatch = inProgress => {
		let html = this.chatLogs.map(msg => {
			let sep = '';
			if (this.lastSession !== msg.session) {
				sep = `<div class="hr"><span>${msg.time}</span></div>`;
				this.lastSession = msg.session;
			}
			return `
				${sep}
				<div class="message ${msg.from === this.firstUser ? 'left' : 'right'}">
					<div class="bubble">${msg.text}</div>
					<div class="user" data-balloon="${msg.time}">${msg.from}</div>
				</div>
			`;
		});
		self.postMessage({
			html: html.join('\n'),
			lastBatch: !inProgress
		});
		this.chatLogs = [];
	}

	this.fatalError = err => {
		self.postMessage({
			html: "Invalid XML",
			lastBatch: true
		});
	}

	this.characters = (data, start, length) => {
		this.characterData += data.substr(start, length);
	}

	this._handleCharacterData = () => {
		if (this.characterData !== "") {
			this._fullCharacterDataReceived(this.characterData);
		}
		this.characterData = "";
	}

	this._fullCharacterDataReceived = (fullCharacterData) => {
		if (this.currentText) {
			this.currentText.push(fullCharacterData);
		}
	}

	this.endDocument = this.sendBatch;

	this.endElement = (name) => {
		this._handleCharacterData();
		if ('Message' === name) {
			this.chatLogs.push(this.currentMessage);
			this.currentMessage = undefined;
			if (this.chatLogs.length % batchSize === 0) {
				this.sendBatch(true);
			}
		}
		if ('Text' === name && this.currentMessage) {
			this.currentMessage.text = this.currentText.join('<br>');
			this.currentText = undefined;
		}
	}

	this.startElement = (name, attrs) => {
		if ('Message' === name) {
			this.currentMessage = {
				time: new Date(attrs.getValueByName('DateTime')),
				session: attrs.getValueByName('SessionID')
			};
		}
		if ('From' === name || 'To' === name) {
			this.currentUserType = name.toLowerCase();
		}
		if ('User' === name && this.currentMessage) {
			let user = attrs.getValueByName('FriendlyName');
			this.currentMessage[this.currentUserType] = user;
			if (!this.firstUser) this.firstUser = user;
		}
		if ('Text' === name) {
			this.currentText = [];
		}
		this._handleCharacterData();
	}
}

const batchSize = 100;
let parser = new SAXDriver();

self.onmessage = (e) => {
	let handler = new SAXEventHandler(batchSize);
	parser.setDocumentHandler(handler);
	parser.setErrorHandler(handler);
	parser.parse(e.data);
}