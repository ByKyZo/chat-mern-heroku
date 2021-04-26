import { Request, Response } from 'express';
import  UserModel  from '../models/user.model';

export default class UserController {

    public static getUser = (req: Request , res: Response) => {
   
        res.send('get user');
    }

    public static async leaveChannel (req: Request , res: Response) {

        const { userID , channelID } = req.body;

        await UserModel.findByIdAndUpdate(userID,{$pull : {channel :  channelID}})
    }

}


