import Follower from "./models/followers";

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