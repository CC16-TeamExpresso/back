require("dotenv").config();
import axios from "axios";
import qs from "querystring";
const client_id = process.env.SPOTIFY_CLIENT_ID; // app's client id 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // app's client secret　
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8050";
const redirect_uri = BACKEND_URL + "/callback"
 
export const spotifyLogin = (req,res)=>{
   //scope of data to be shared with our app need to declared
  console.log("spotifylogin")
  const scope =
    "user-read-private user-read-email user-read-currently-playing user-read-playback-state user-read-playback-position";

   //redirects the user to spotify authorization page
   //when user clicks agree button, app will receive a code and be redirected to "/callback"
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      qs.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
};

// Once redirected to /callback, app sends code and credentials to spotify to get token
export const getToken = (req,res)=>{ 
      const code: any = req.query.code || null;

      axios({
      method:'POST',
      url:"https://accounts.spotify.com/api/token", 
      data: qs.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirect_uri
      }),
      headers:{ 
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64")
      }
      }) 
      .then((response)=>{
        let access_token=response.data.access_token       
        
      //Pass the token to the browser to make requests for current playing from there
      let FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
        res.redirect(
      // To redirect to the front end url (hardcoded in this case)
              //"http://localhost:3000/feed/?" +
              FRONTEND_URL + "/feed/?" +
               qs.stringify({
               access_token: access_token,               
             })
        )
      })
      .catch(err=>{console.log(err.message)})};

 


