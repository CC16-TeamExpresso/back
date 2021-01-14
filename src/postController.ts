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
	username: string,
	post: any,

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
