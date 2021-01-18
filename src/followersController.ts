import Follower from "./models/followers";
import User from "./models/user";

export const addFollower = async (req, res) => {
  const userOwn = res.locals.user;
  const followUserId = req.params.userid;
  const result = await Follower.updateOne({_id: userOwn.followers},{
    $push:{
      followers: followUserId
    }
  })
  if(result.ok === 1) {
  res.json({status: "ok"});
  } else {
    res.json({status: "ng"});
  }
}

interface followerObj{
  id: String,
  username: String,
  post: any
}

export const getOwnFollower = async (req, res) => {
  const userOwn = res.locals.user;
  const followers = await  Follower.findOne({_id: userOwn.followers});
  const result = [];
  for(const follower of followers.followers) {
    const user = await User.findOne({_id: follower})
      .select("_id username posts")
      .populate({
        path:"posts",
      })
      .exec();
    result.push(user);
  }
  const resultObj :followerObj[] = [];
  result.forEach((data) => {
    const obj : followerObj = {
      id: data._id,
      username: data.username,
      post: data.posts[data.posts.length - 1]
    }
    resultObj.push(obj);
    })
  res.json({result: resultObj});
}