import { Request, Response } from 'express';
import ChannelModel from '../models/channel.model';
import UserModel from '../models/user.model';
import MessageModel from '../models/message.model';
import { json } from 'body-parser';

export default class ChannelController {

    public static async createChannel (userID: String , name: String, description: String) {

        const channel = await ChannelModel.create({ name , description , owner : userID })

        const user = await UserModel.findByIdAndUpdate(userID,{ $addToSet : { channel : channel._id }},{ new : true })

        return channel;

        // await ChannelModel.deleteMany({})
    }

    public static async getAllChannelByUserId (req: Request , res: Response) {

        const userID = req.params.id;
        const user = await UserModel.findById(userID); 

        if (!user || user.channel.length === 0) return res.status(500).send('');

        const channels = await ChannelModel.find({_id : {$in : user.channel}})

        res.status(200).send(channels);
    }

    public static getChannelMessage (req: Request , res: Response) {

        const channelID = req.params.id;

        MessageModel.find({},(err: any, docs: any) => {
            if (err) return res.status(500).send('Channel message Error : ' + err);

            res.status(200).send(docs);
        })

    }

    public static async getAllChannelByNotMatchUserID (req: Request , res: Response) {

        const userID = req.params.id;
        const user = await UserModel.findById(userID); 

        const channels = await ChannelModel.find({_id : {$nin : user.channel}})

        res.status(200).send(channels);
    }

    public static async joinChannel (userID: String , channelID: undefined) {

        const joinedUser = await UserModel.findByIdAndUpdate(userID,{ $addToSet : { channel : channelID }},{ new : true }).select('-password -email -channel -remember_me_token')

        const joinedChannel = await ChannelModel.findById(channelID);

        return {joinedChannel , joinedUser};
    }

    public static async getUsersChannel (req: Request ,  res: Response) {

        const channelID = req.params.id;

        const user = await UserModel.find({channel : channelID}).select('-password -email -channel -remember_me_token');

        res.status(200).send(user);
    }

    public static async banChannelMember (bannedUserID: String , channelID: String) {

        const bannedMember = await UserModel.findByIdAndUpdate(bannedUserID , {$pull : {channel : channelID}})

        return bannedMember;
    }

}

 
