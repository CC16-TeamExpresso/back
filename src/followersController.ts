import Follower from "./models/followers";
import User from "./models/user";
import { calcDistance } from "./userController";

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
  userid: String,
  username: String,
  post: any,
  lat: String,
  lng: String,
  distance: number
}

export const getOwnFollower = async (req, res) => {
  const userOwn = res.locals.user;
  const followers = await  Follower.findOne({_id: userOwn.followers});
  const result = [];
  for(const follower of followers.followers) {
    const user = await User.findOne({_id: follower})
      .select("_id username posts lat lng")
      .populate({
        path:"posts",
      })
      .exec();
    result.push(user);
  }
  const resultObj :followerObj[] = [];
  result.forEach((data) => {
    const obj : followerObj = {
      userid: data._id,
      username: data.username,
      post: data.posts[data.posts.length - 1],
      lat: data.lat,
      lng: data.lng,
      distance: calcDistance(userOwn.lat, userOwn.lng, data.lat, data.lng)
    }
    resultObj.push(obj);
    })
  resultObj.sort((x, y) => x.distance - y.distance);
  res.json({result: resultObj});
}