import WebSocket from 'ws';
import { CustomWebSocket, processMessage } from './utilities';
import Message from './models/messages';
import { v4 as uuid } from 'uuid';

let clients: WebSocket[] = [];

export default function setupWebSocketServer() {
	const wss = new WebSocket.Server({
		port: 1338,
	});
	wss.on('connection', function connection(ws: CustomWebSocket) {
		//look at utilities
		ws.connectionID = uuid(); //create connection ID
		clients.push(ws);
		ws.on('close', () => {
			//when connection is closed the user is removed from clients
			clients = clients.filter((generalSocket) => ws.connectionID !== ws.connectionID);
		});
		ws.on('message', function incoming(payload) {
			const message = processMessage(payload.toString());
			if (!message) {
				//broken msg
				return;
			}

			const newMessage = new Message({
				email: 'user@a.com',
				message: message.message,
				date: Date.now(),
			});

			newMessage.save();

			for (let i = 0; i < clients.length; i++) {
				//comments or messages should be seen by all connected clients as soon as the the msg is sent
				const client = clients[i];
				client.send(
					JSON.stringify({
						message: message.message,
						user: 'user',
						intent: 'chat',
					})
				);
			}

			//ws.send(JSON.stringify({ ...message, user: 'self', intent: 'chat' })); //messges from self for now
			console.log(message, 'is the message');
		});
	});
}
