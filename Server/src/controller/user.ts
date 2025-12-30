import { Request, Response } from "express";

export const testController = (req: Request, res: Response) => {
  console.log('Server Running');
    
  res.status(200).json({
    success: true,
    message: "🚀 Server is running"
  });
}