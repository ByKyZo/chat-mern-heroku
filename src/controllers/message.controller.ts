import MessageModel from '../models/message.model';
import UserModel from '../models/user.model';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default class MessageController {

    // FORMATER LA DATE
    // ESSAYER DE LE FAIRE A LA CREATION DU MESSAGE
    public static async sendMessage (userID: String  , channelID: String , message: String) {

        const user = await UserModel.findById(userID).select('-channel -password -email -remember_me_token');

        let messageSend = await MessageModel.create({userID,channelID,message})

        const mess = messageSend.toObject();

        mess.user = user;

        return mess;

        // await MessageModel.deleteMany({});
    }

    public static deleteMessage (req: Request , res: Response) {
        
    }

}