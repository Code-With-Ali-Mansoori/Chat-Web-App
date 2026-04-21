import {Request, Response} from 'express';
import user_model from '../model/user_schema';
import { v4 as uuidv4 } from 'uuid';
import jwt, { JwtPayload } from 'jsonwebtoken';

export type OAuthUser = {
  provider: "google" | "facebook";
  provider_Id: string;
  email?: string ;
  user_avatar: string ;
  provider_name: string;
}

export const handleOAuth = async (req : Request, res : Response) => {
    try {

      const user = req.user as OAuthUser | undefined;

      if (!user) {return res.status(404).json({message : 'User data not found!'});}
      if (user && !user.email) {return res.status(404).json({message : 'Email not found!'});}

      const payload = {
        provider: user.provider,
        provider_Id: user.provider_Id,
        email : user.email,
      };

      const JWT_Password = process.env.JWT_SECRET as string;
      const token = jwt.sign(payload as JwtPayload , JWT_Password);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });

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

      console.log(process.env.CLIENT_URL!.toString());
  
      const clientUrl = 'http://localhost:5173';
      
      console.log('Runn2');
      return res.redirect(`${clientUrl}/profile/setup`); 
      //redirect to Profile-Setup page
    };;;

    console.log('Runn3');
    const clientUrl ='http://localhost:5173';
    return res.redirect(clientUrl);

    } catch (error) {
      console.log("Error : ", error);
      return res.status(500).json({message : error});
    };
}; 