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
		//ws.send(JSON.stringify({ ...message, user: 'self', intent: 'chat' })); //messges from self for now
		console.log(message, 'is the message');
	});
});

//reference from authentication : https://github.com/websockets/ws
//// This function is not defined on purpose. Implement it with your own logic.

// const http = require('http');
// const WebSocket = require('ws');

// const server = http.createServer();
// const wss = new WebSocket.Server({ noServer: true });

// wss.on('connection', function connection(ws, request, client) {
//   ws.on('message', function message(msg) {
//     console.log(`Received message ${msg} from user ${client}`);
//   });
// });

// server.on('upgrade', function upgrade(request, socket, head) {
//   // This function is not defined on purpose. Implement it with your own logic.
//   authenticate(request, (err, client) => {
//     if (err || !client) {
//       socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//       socket.destroy();
//       return;
//     }

//     wss.handleUpgrade(request, socket, head, function done(ws) {
//       wss.emit('connection', ws, request, client);
//     });
//   });
// });

// server.listen(8080);

server.listen(1338);
