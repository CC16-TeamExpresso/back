var ws_1 = require('ws');
var utilities_1 = require('./utilities');
function setupWebSocketServer() {
    var wss = new ws_1["default"].Server({
        port: 1338
    });
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(payload) {
            var message = utilities_1.processMessage(payload.toString());
            if (!message) {
                //broken msg
                return;
            }
            ws.send(JSON.stringify(message));
            console.log(message, 'is the message');
        });
    });
}
exports["default"] = setupWebSocketServer;
