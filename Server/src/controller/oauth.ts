import {Request, Response} from 'express';
import user_model from '../model/user_schema';
import { v4 as uuidv4 } from 'uuid';

export type OAuthUser = {
  provider: "google" | "facebook";
  provider_Id: string;
  email?: string ;
  user_avatar: string ;
  provider_name: string;
}

export const handleGoogleOAuth = async (req : Request, res : Response) => {
    try {

      const user = req.user as OAuthUser | undefined;

      if (!user) {return res.status(404).json({message : 'User data not found!'});}
      if (user && !user.email) {return res.status(404).json({message : 'Email not found!'});}

      const DB_user = await user_model.findOne({email : user?.email});

      if (!DB_user) { 

      const randomUsername = uuidv4();
    
      await user_model.create({
        email : user.email,
        provider : user.provider,
        provider_Id : user.provider_Id,
        provider_name : user.provider_name,
        user_avatar : user.user_avatar,
        isProfileCompleted : false,
        username : randomUsername
      });

      res.render('User_Info');
      // return res.status(201).json({message : 'User Created Succesfully!'});
      return
    };

    return res.status(200).json({message : {
      user : DB_user
    }});

    } catch (error) {
      res.status(500).json({message : error});
      return

    };
};  

export const handleFBOAuth = async (req : Request, res : Response) => {
      try {

      const user = req.user as OAuthUser | undefined;

      if (!user) {return res.status(404).json({message : 'User data not found!'});}
      if (user && !user.email) {return res.status(404).json({message : 'Email not found!'});}

      const DB_user = await user_model.findOne({email : user?.email});

      if (!DB_user) { 

      const randomUsername = uuidv4();
    
      await user_model.create({
        email : user.email,
        provider : user.provider,
        provider_Id : user.provider_Id,
        provider_name : user.provider_name,
        user_avatar : user.user_avatar,
        isProfileCompleted : false,
        username : randomUsername
      });

      // res.render('User_Info');
      res.status(201).json({message : 'User Created By Facebook Succesfully! 😎'});
      return 
    };

    return res.status(200).json({message : {
      user : DB_user
    }});

    } catch (error) {
      res.status(500).json({message : error});
      return

    };
};
