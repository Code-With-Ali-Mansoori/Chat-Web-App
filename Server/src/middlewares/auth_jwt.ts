import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  provider: string;
  provider_Id: string;
  email: string;
}

export const authCheck = (req : Request, res : Response, next: NextFunction) => {
try {

    const isCookie = req.cookies.token;

    if (!isCookie) {
        res.status(401).json({ message: "User is Un-authorized" });
        return;
    };
 
    const decoded  = jwt.verify(isCookie, process.env.JWT_SECRET as string) as AuthPayload
    
    if ( !decoded ) {
        console.log(decoded);
        
        return res.status(400).json({message : "Token is invalid"})
    };

    req.user = decoded;
    next();

} catch (error) {
    console.log(error);
    res.status(500).json({message : 'Error in JWT Auth Middlwares'})
}};
