import express from "express";
import passport from "passport";
import { handleOAuth } from "../controller/oauth";
import { authCheck } from "../middlewares/auth_jwt";
// import { chat_sockets, welcome_sockets } from "../config/socket.handler";

const oauth_route = express.Router();

//Sample Page
oauth_route.get('/ejs', ( req : express.Request ,res : express.Response ) => {
    return res.render('login')
}); 

oauth_route.get('/profile',( req : express.Request ,res : express.Response ) => {
    return res.render('User_Info')
}); 

// Testing Sockets
// oauth_route.get('/welcome', authCheck , welcome_sockets); 
// oauth_route.get('/chat', authCheck , chat_sockets); 


//Google
oauth_route.get("/auth/google", 
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

oauth_route.get("/redirects/google/user/chat_app", 
    passport.authenticate('google', { failureRedirect: '/oauth/auth/google', session: false }),
    handleOAuth
);

//Facebook
oauth_route.get("/auth/facebook", 
    passport.authenticate('facebook', { scope: ['email'], session: false })
);

oauth_route.get("/facebook/redirects", 
    passport.authenticate('facebook', { failureRedirect: '/oauth/auth/facebook', session: false }),
    handleOAuth
);

export default oauth_route;