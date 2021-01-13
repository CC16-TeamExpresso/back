import { CustomWebSocket } from './utilities';
import Message from './models/messages';
import { v4 as uuid } from 'uuid';

export let clients: CustomWebSocket[] = [];

export function setClients(newClients: CustomWebSocket[]) {
	clients = newClients;
}

export function broadcastMessage(message: any, ws: CustomWebSocket) {
	const newMessage = new Message({
		email: ws.connectionID,
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
				user: ws.connectionID,
				intent: 'chat',
			})
		);
	}
	//server.listen(1338);
	//ws.send(JSON.stringify({ ...message, user: 'self', intent: 'chat' })); //messges from self for now
	console.log(message, 'is the message');
}

export async function retrieveAndSendMessages(ws: CustomWebSocket, count: number) {
	const messages = await Message.find({}, { email: 1, message: 1 })
		.sort({ date: 1 })
		.limit(count)
		.lean(); //get js based array
	ws.send(
		JSON.stringify({
			intent: 'old-messges',
			data: messages,
		}) // this if the recevied websocket request from client has ,old messages, intent the respond is all the messages in the db ordered based on date
	);
}
