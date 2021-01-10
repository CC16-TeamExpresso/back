import WebSocket from 'ws';
import { processMessage } from './utilities';

export default function setupWebSocketServer() {
	const wss = new WebSocket.Server({
		port: 1338,
	});
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(payload) {
			const message = processMessage(payload.toString());
			if (!message) {
				//broken msg
				return;
			}
			ws.send(JSON.stringify({ ...message, user: 'self', intent: 'chat' })); //messges from self for now
			console.log(message, 'is the message');
		});
	});
}
