require('dotenv').config();
import express from 'express'; // ts
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/user';
import jwt from 'jsonwebtoken';
import setupWebSocketServer from './websocket';
import { verifyJWT, test } from './verifyJWT';

const app = express();

//please use .env!
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
const PORT = process.env.PORT || 8050;

mongoose.connect('mongodb+srv://expresso:expresso@cluster0.ire4b.mongodb.net/peekify');

// for local test
// mongoose.connect('mongodb://localhost:27017/peekify');

if (process.env.NODE_ENV !== 'production') {
	app.use(cors()); //only used for development
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('server works check 1');
});

app.post('/register', async (req, res) => {
	console.log(req.body);
	//we need to use bcrypt to hash the password
	const { email, password } = req.body;

	if (!email || !password) {
		//I used this to check if we have the email and passwrof from the request
		return res.json({ status: 'error', error: 'Invalid email/password' });
	}

	try {
		const user = new User({ email, password }); //
		await user.save();

		return res.json({ status: 'ok'});

	} catch (error) {
		console.log('Error', error);
		res.json({ status: 'error', error: 'Email is duplicated' }); //error should be checked but its "duplicated email problem" mostly
	}
	res.json({ status: 'okkkkk' });
});

app.post('/login', async (req, res) => {
	console.log(req.body);

	const { email, password } = req.body;

	const user = await User.findOne({ email, password }).lean(); //match the email and password and the record for that user . "Lean" keyword  will remove out all the meta data coming with the mongo object and get us a plain json object

	if (!user) {
		return res.json({ status: 'error', error: 'User Not Registered' });
	}

	const payload = jwt.sign({ email }, JWT_SECRET_TOKEN); //payload of the user, this will SIGN the email with the token.
	//Note: the jwt_secret_token I wrote needs more randomness

	return res.json({ status: 'ok', data: payload });
});

//verifyJWT middleware.
//when endpoint is /api/*, always checking JWT.
app.use('/api', verifyJWT);

//exapmle of how to use JWT
//test is a function -> check src/verifyJWT
app.post('/api/test', test);

app.listen(PORT, () => {
	console.log(`The server has started on the number: ${PORT}`);
});
setupWebSocketServer();
