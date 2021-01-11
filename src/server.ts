require('dotenv').config();
import express from 'express'; // ts
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import setupWebSocketServer from './websocket';
import { verifyJWT, test } from './verifyJWT';
import { register, login } from "./userController";
import { spotifyLogin, getToken, getUriFromFront}  from "./spotify";

const app = express();

//please use .env!
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
const PORT = process.env.PORT || 8050;

//mongoose.connect('mongodb+srv://expresso:expresso@cluster0.ire4b.mongodb.net/peekify');

// for local test
mongoose.connect('mongodb://localhost:27017/peekify');

if (process.env.NODE_ENV !== 'production') {
	app.use(cors()); //only used for development
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('server works check 2');
});

app.post('/register', register);

app.post('/login', login);

//verifyJWT middleware.
//when endpoint is /api/*, always checking JWT.
app.use('/api', verifyJWT);

//exapmle of how to use JWT
//test is a function -> check src/verifyJWT
app.post('/api/test', test);

//login with spotify
app.get("/spotifylogin", spotifyLogin) 

//get access_token for query
app.get("/callback", getToken)  

//get uri from front
app.post('/senduri', getUriFromFront)

app.listen(PORT, () => {
	console.log(`The server has started on the number: ${PORT}`);
});
setupWebSocketServer();
