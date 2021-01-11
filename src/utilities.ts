import WebSocket from 'ws';

export function processMessage(payload: string) {
	try {
		return JSON.parse(payload);
	} catch (error) {
		return null;
	}
}

export interface CustomWebSocket extends WebSocket {
	connectionID: string;
}
