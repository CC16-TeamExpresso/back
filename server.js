var express_1 = require('express'); // ts
var body_parser_1 = require('body-parser');
var cors_1 = require('cors');
var mongoose_1 = require('mongoose');
var user_1 = require('./models/user');
var jsonwebtoken_1 = require('jsonwebtoken');
var websocket_1 = require('./websocket');
var app = express_1["default"]();
var JWT_SECRET_TOKEN = 'qwgbypaoosixakkknbyyuyumnnusfhdsknfcksdnvcduhvjdfnajdhjkdlfjhjd';
mongoose_1["default"].connect('mongodb://localhost:27017/peekify');
if (process.env.NODE_ENV !== 'production') {
    app.use(cors_1["default"]());
}
app.use(body_parser_1["default"].json());
app.get('/', function (req, res) {
    res.send('server works');
});
app.post('/api/register', async(req, res), {
    console: .log(req.body),
    const: (_a = req.body, email = _a.email, password = _a.password, _a),
    if: function () { } }, !email || !password);
{
    return res.json({ status: 'error', error: 'Invalid email/password' });
}
try {
    var user = new user_1["default"]({ email: email, password: password });
    await;
    user.save();
}
catch (error) {
    console.log('Error', error);
    res.json({ status: 'error', error: 'there is an error check it from error status code' });
}
res.json({ status: 'okkkkk' });
;
app.post('/api/login', async(req, res), {
    console: .log(req.body),
    const: (_b = req.body, email = _b.email, password = _b.password, _b),
    const: user = await, User: .findOne({ email: email, password: password }).lean(),
    if: function () { } }, !user);
{
    return res.json({ status: 'error', error: 'User Not Registered' });
}
var payload = jsonwebtoken_1["default"].sign({ email: email }, JWT_SECRET_TOKEN);
return res.json({ status: 'ok', data: payload });
;
app.listen(8050);
websocket_1["default"]();
var _a, _b;
