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