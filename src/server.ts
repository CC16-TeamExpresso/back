require('dotenv').config();
import express from 'express'; // ts
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { verifyJWT, test } from './verifyJWT';
import { spotifyLogin, getToken} from './spotify';
import { register, login, getUsers, updateGPS, getUsersFiltered, getOtherUser } from './userController';
import { postMusic, getOwnPosts, getMessages, increaseLike, decreaseLike } from './postController';
import { addFollower, getOwnFollower } from "./followersController";

const app = express();

//please use .env!
const PORT = process.env.PORT || 8050;

mongoose.connect('mongodb+srv://expresso:expresso@cluster0.ire4b.mongodb.net/peekify');

// for local test
// mongoose.connect('mongodb://localhost:27017/peekify');

// if (process.env.NODE_ENV !== 'production') {
	app.use(cors()); //only used for development
// }

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
app.get('/spotifylogin', spotifyLogin);

//get access_token for query
app.get('/callback', getToken);

//post uri
app.post('/api/music', postMusic);

//get users
app.get('/api/user', getUsers);

//get users filterd by distance
app.get('/api/user/filter', getUsersFiltered)

//get another user data
app.get('/api/user/:userid', getOtherUser);

//get own post history
app.get('/api/post', getOwnPosts)

//get messages on the post
app.get("/api/message/:postid", getMessages);

//updateGPS data
app.patch('/api/usergps', updateGPS);

//update like's count -> +1
app.patch('/api/like/:postid', increaseLike);

//update like's count -> -1
app.patch('/api/dislike/:postid', decreaseLike);

//add an user to followers list
app.patch('/api/follow/:userid', addFollower);

//get followers list
app.get('/api/follow',getOwnFollower);

app.listen(PORT, () => {
	console.log(`The server has started on the number: ${PORT}`);
});
//setupWebSocketServer();
