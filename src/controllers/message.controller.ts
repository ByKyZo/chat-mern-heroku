import MessageModel from '../models/message.model';
import UserModel from '../models/user.model';
import { Request, Response } from 'express';

export default class MessageController {

    // FORMATER LA DATE
    // ESSAYER DE LE FAIRE A LA CREATION DU MESSAGE
    public static async sendMessage (userID: String  , channelID: String , message: String) {

        const user = await UserModel.findById(userID).select('-channel -password -email -remember_me_token');

        const messageSend = await MessageModel.create({user,channelID,message})

        // messageSend = await JSON.parse(JSON.stringify(messageSend));
        // console.log(messageSend)
        // messageSend.createdAt = await messageSend.createdAt.replaceAll('-','/');
        return messageSend;
        // await MessageModel.deleteMany({});
    }

    public static deleteMessage (req: Request , res: Response) {
        
    }

}