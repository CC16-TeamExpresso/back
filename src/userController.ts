import User from './models/user';
import Post from "./models/post"
import { encrypto } from "./crypto";
import jwt from 'jsonwebtoken';
import { postMusic } from './postController';

const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;

export const register = async (req, res) => {
	console.log(req.body);
	//we need to use bcrypt to hash the password
	const { email, password, username, lat, lng  } = req.body;

	if (!email || !password || !username) {
		//I used this to check if we have the email and passwrof from the request
		return res.json({ status: 'error', error: 'Invalid email/password/username' });
	}

	try {
    const passwordHash = encrypto(password);
		const user = new User({ email, password: passwordHash, username, lat, lng }); 
		await user.save();

		return res.json({ status: 'ok'});

	} catch (error) {
		console.log('Error', error);
		res.json({ status: 'error', error: 'Email is duplicated' }); //error should be checked but its "duplicated email problem" mostly
	}
	res.json({ status: 'okkkkk' });
}

export const login = async (req, res) => {
	console.log(req.body);

  const { email, password } = req.body;
  const passwordHash = encrypto(password);

	const user = await User.findOne({ email, password: passwordHash }).lean(); //match the email and password and the record for that user . "Lean" keyword  will remove out all the meta data coming with the mongo object and get us a plain json object

	if (!user) {
		return res.json({ status: 'error', error: 'User Not Registered' });
	}

	const payload = jwt.sign({ email }, JWT_SECRET_TOKEN); //payload of the user, this will SIGN the email with the token.
	//Note: the jwt_secret_token I wrote needs more randomness

	return res.json({ status: 'ok', data: payload });
}

interface userObj{
	username: string,
	lat: number,
	lng: number,
	post: any,
}
//get users except myself, with last post info
export const getUsers = async (req, res) => {
	const userOwn = res.locals.user;
	const users =  await User.find({email: {"$ne": userOwn.email}})
		.populate({
			path: "posts"
		})
		.exec();
	const result: userObj[] = [];
	users.forEach((user: any) => {
		const obj: userObj = {
			username: user.username,
			lat: user.lat,
			lng: user.lng,
			post: user.posts[user.posts.length - 1]
		};
		result.push(obj);
	})
	res.json({result})
}