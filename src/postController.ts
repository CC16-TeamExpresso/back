import User from './models/user';
import Post from "./models/post";

export const postMusic = async (req, res) => {
  const user = res.locals.user;
  const uriPost : String = req.body.uri;
  const arr: String[] = uriPost.split(":");
  const uri = `${arr[1]}/${arr[2]}`;
  //something to varify 
  try{
    const post = new Post({email: user.email, uri});
    const result = await post.save();
    const resultUser = await User.updateOne({email: user.email},{
      $push:{
        posts: result._id
      }
    })
    res.json({result: resultUser.ok});
  } catch(error) {
    console.log("Error:", error);
    res.json({status: "error"});
  }
}

interface userObj{
	username: string;
	post: any;
}

export const getOwnPosts = async (req, res) => {
	const userOwn = res.locals.user;
	const users =  await User.find({email:  userOwn.email})
		.populate({
			path: "posts"
		})
		.exec();
	const result: userObj[] = [];
	users.forEach((user: any) => {
		if(user.posts.length > 0) {
			const obj: userObj = {
				username: user.username,
				post: user.posts,
			};
			result.push(obj);
		}
	})
	res.json({result})
}

interface messageObj {
  username: String;
  message: String;
}

export const getMessages = async (req, res) => {
  const postId = req.params.postid;
  const results: any = await Post.findOne({_id: postId})
    .populate({
      path: "messages"
    })
    .exec();
  const messages = results.messages;
  const result = [];
  messages.forEach((message) => {
    const obj: messageObj = {
    username: message.email,
    message: message.message
    }
    result.push(obj);
  })
  res.json({result});
}

export const increaseLike = async (req, res) => {
  const postId = req.params.postid;
  const result: any = await Post.findOne({_id: postId});
  const like = result.like + 1;
  const resultInsert = await Post.updateOne({_id: postId}, {
    like: like
  });
  if(resultInsert.ok === 1) {
    res.json({status:"ok", like: like});
  }else {
    res.json({status: "ng"});
  }
}

export const decreaseLike = async (req, res) => {
  const postId = req.params.postid;
  const result: any = await Post.findOne({_id: postId});
  const like = result.like === 0 ? 0 : result.like - 1;
  const resultInsert = await Post.updateOne({_id: postId}, {
    like: like
  });
  if(resultInsert.ok === 1) {
    res.json({status:"ok", like: like});
  }else {
    res.json({status: "ng"});
  }
}
