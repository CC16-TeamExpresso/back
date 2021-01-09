require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
import User from "./models/user";

const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;


export const verifyJWT = (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    jsonwebtoken.verify(
      token,
      JWT_SECRET_TOKEN,
      (errors, payload) => {
        if (payload) {
          User.findOne({email:payload.email})
            .then((user) => {
              res.locals.user = user;
              next();
            })
        } else {
          res.status(401).json({
            error: true,
            message: "cannnot verify API token"
          })
        }
      }
    )
  } else {
    res.status(400).json({
      error: true,
      message: "Provide Token"
    });
  }
}


//example: how to use JWT 
export const test = (req, res) => {
  //if JWT is autheticated, you can get user information from "res.locals.user"
  const user = res.locals.user;
  const { lat, lng } = req.body;
  res.json({
    user,
    lat,
    lng
  });
}