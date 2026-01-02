import express from "express";
import passport from "passport";
import { handleFBOAuth, handleGoogleOAuth } from "../controller/oauth";

const route = express.Router();

route.get('/ejs', ( req : express.Request ,res : express.Response ) => {
    return res.render('login')
}); 

// route.get('/auth/facebook/redirects', ( req : express.Request ,res : express.Response ) => {
//     return res.json('hh')
// }); 

//Google
route.get("/auth/google", 
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

route.get("/redirects/google/user/chat_app", 
    passport.authenticate('google', { failureRedirect: '/oauth/auth/google', session: false }),
    handleGoogleOAuth
);

//Facebook
route.get("/auth/facebook", 
    passport.authenticate('facebook', { scope: ['email'], session: false })
);

route.get("/facebook/redirects", 
    passport.authenticate('facebook', { failureRedirect: '/oauth/auth/facebook', session: false }),
    handleFBOAuth
);

export default route;