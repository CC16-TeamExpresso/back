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

	const user: any = await User.findOne({ email, password: passwordHash }).lean(); //match the email and password and the record for that user . "Lean" keyword  will remove out all the meta data coming with the mongo object and get us a plain json object

	if (!user) {
		return res.json({ status: 'error', error: 'User Not Registered' });
	}

	const payload = jwt.sign({ email, username: user.username }, JWT_SECRET_TOKEN); //payload of the user, this will SIGN the email with the token.
	//Note: the jwt_secret_token I wrote needs more randomness

	return res.json({ status: 'ok', data: payload });
}

//for getUsers
interface userObj{
	username: string,
	lat: number,
	lng: number,
	post: any,
	distance: number
}

//utiliti function calc distance from lat/lng
const calcDistance = (lat1, lng1, lat2, lng2) => {
  const lat1PI = lat1 * Math.PI / 180;
  const lng1PI = lng1 * Math.PI / 180;
  const lat2PI = lat2 * Math.PI / 180;
  const lng2PI = lng2 * Math.PI / 180;
  const dis = 6371 * Math.acos(Math.cos(lat1PI) * Math.cos(lat2PI) * Math.cos(lng2PI - lng1PI) + Math.sin(lat1PI) * Math.sin(lat2PI));
  return dis;
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
		if(user.posts.length > 0) {
			const obj: userObj = {
				username: user.username,
				lat: user.lat,
				lng: user.lng,
				post: user.posts[user.posts.length - 1],
				distance: calcDistance(userOwn.lat, userOwn.lng, user.lat, user.lng)
			};
			result.push(obj);
		}
	})
	result.sort((x, y) => x.distance - y.distance);
	res.json({result})
}

export const updateGPS = async (req, res) => {
	const user = res.locals.user;
	console.log(user);
	const { lat, lng } = req.body;
	try{
		const result = await User.updateOne({email:user.email},{lat, lng});
		res.json({status: "ok", user: user.username})
	} catch(err) {
		console.log(err);
		res.json({status:"error"})
	}
}