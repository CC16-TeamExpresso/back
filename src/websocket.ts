require('dotenv').config();
import WebSocket from 'ws';
import { CustomWebSocket, processMessage } from './utilities';
import Message from './models/messages';
import { v4 as uuid } from 'uuid';
import http from 'http';
import jwt from 'jsonwebtoken';
import { verifyJWT, test } from './verifyJWT';

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

let clients: WebSocket[] = [];

wss.on('connection', function connection(ws: CustomWebSocket) {
	//look at utilities
	//create connection ID
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
		//server.listen(1338);
		//ws.send(JSON.stringify({ ...message, user: 'self', intent: 'chat' })); //messges from self for now
		console.log(message, 'is the message');
	});
});

//reference from authentication : https://github.com/websockets/ws
server.on('upgrade', function upgrade(request, socket, head) {
	const token = request.url.slice(1); //remove the backslash from the token url that we got from request
	//console.log('REQUEST', request);
	const payload: any = jwt.verify(token, process.env.JWT_SECRET_TOKEN); //verfity if token is correctly signed and change the type?
	if (!payload) {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
		socket.destroy();
		return;
	}
	wss.handleUpgrade(request, socket, head, function done(ws) {
		const _ws = ws as CustomWebSocket;
		_ws.connectionID = payload.email;

		wss.emit('connection', ws, request);
	});
});

server.listen(1338);
