import passport from "passport";
import {Strategy as GoogelStrategy, Profile as Google_Profile} from 'passport-google-oauth20';
import {Strategy as FB_Strategy, Profile as FB_Profile} from 'passport-facebook';

passport.use(new GoogelStrategy({
    clientID : process.env.Google_Client_ID!,
    clientSecret : process.env.Google_Client_Secret!,
    callbackURL : process.env.Google_Redirect_URL
},
    (
      accessToken : string | null , 
      refreshToken : string | null , 
      profile : Google_Profile, 
      done 
    ) => {
        try {

            const user = {
                provider : 'Google',
                provider_Id : profile.id,
                email : profile.emails?.[0]?.value || null,
                user_avatar: profile.photos?.[0]?.value || null,
                provider_name : profile.displayName  
            }

            return done(null, user);

        } catch (error) {
            return done(error as Error, undefined);

        }
    }
));

passport.use(new FB_Strategy(
{
    clientID : process.env.FB_Client_ID!,
    clientSecret : process.env.FB_Client_Secret!,
    callbackURL : process.env.FB_Redirect_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
},
    ( accessToken : string | null , 
      refreshToken : string | null , 
      profile : FB_Profile, 
      done 
    ) => {
        try {
            const user = {
                provider : 'Facebook',
                provider_Id : profile.id,
                email : profile.emails?.[0]?.value || null,
                user_avatar: profile.photos?.[0]?.value || null,
                provider_name : profile.displayName  
            };

            return done(null, user);
            
        } catch (error) {
            return done(error as Error, undefined);

        };
    }       
));