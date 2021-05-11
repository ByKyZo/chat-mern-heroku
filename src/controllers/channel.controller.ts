import { Request, Response } from 'express';
import ChannelModel from '../models/channel.model';
import UserModel from '../models/user.model';
import MessageModel from '../models/message.model';

export default class ChannelController {

    public static async createChannel (userID: String , name: String, description: String) {

        const channel = await ChannelModel.create({ name , description , owner : userID ,  notifications : { userID } }) 

        const user = await UserModel.findByIdAndUpdate(userID,{ $addToSet : { channel : channel._id }},{ new : true })

        return channel;

        // await ChannelModel.deleteMany({})
    }

    public static async getAllChannelByUserId (req: Request , res: Response) {

        const userID = req.params.id;
        const user = await UserModel.findById(userID , async (err: any , docs: any) => {

            const user = docs.toObject();

            if (!user || user.channel.length === 0) return res.status(500).send('');

            const channels = await ChannelModel.find({_id : {$in : user.channel}})
    
            res.status(200).send(channels);
        }); 
    }

    public static getChannelMessage (req: Request , res: Response) {

        const channelID = req.params.id;

        MessageModel.find({}, async(err: any, docs: any) => {
            if (err) return res.status(500).send('Channel message Error : ' + err);
            const messages = docs.map((doc: any) => doc.toObject());

            for (let i = 0 ; i < messages.length ; i++) {
                const user = await UserModel.findById(messages[i].userID).select('-channel -password -email -remember_me_token'); 
                messages[i].user = user;
            }
            res.status(200).send(messages);
        })

    }

    public static async getAllChannelByNotMatchUserID (req: Request , res: Response) {

        const userID = req.params.id;

        UserModel.findById(userID , async (err: any , docs: any) => {

            const user = docs.toObject();

            const channels = await ChannelModel.find({_id : {$nin : user.channel}})

            res.status(200).send(channels);
        }); 

    }

    public static async joinChannel (userID: String, channelID: String) {

        const joinedUser = await UserModel.findByIdAndUpdate(userID,{ $addToSet : { channel : channelID }},{ new : true }).select('-password -email -channel -remember_me_token')
 
        const joinedChannel = await ChannelModel.findByIdAndUpdate(channelID , { $addToSet : { notifications : { userID } } }, { new : true }); // peut etre new : true

        return {joinedChannel , joinedUser};
    }

    public static async getUsersChannel (req: Request ,  res: Response) {

        const channelID = req.params.id;

        const user = await UserModel.find({channel : channelID}).select('-password -email -channel -remember_me_token');


        res.status(200).send(user);
    }

    public static async banChannelMember (bannedUserID: String , channelID: String) {

        const bannedMember = await UserModel.findByIdAndUpdate(bannedUserID , { $pull : { channel : channelID } })
        ChannelModel.findByIdAndUpdate(channelID , { $pull : { notifications : { userID : bannedUserID } } } , (err: any , docs: any) => docs.save())

        return bannedMember;
    }

    public static async deleteChannel (channelID: String) {

        await UserModel.updateMany({$pull : { channel : channelID }})

        return await ChannelModel.findByIdAndDelete(channelID);
    }

    public static async channelNotification (channelID: String) {

        // TROUVER POURQUOI 9A sincremente pas
        // find and update
        const channelNotifiedUpdated = await ChannelModel.updateMany({ _id : channelID} , { $inc : {'notifications.$[].notification' : 1 }})
        const channelNotified = await ChannelModel.findById(channelID);

        return channelNotified;
    }

    public static async resetNotification (req: Request , res: Response) {

        const { userID , channelID } = req.body;

        const channel = await ChannelModel.updateOne({_id : channelID, notifications : {$elemMatch : {userID : userID}}},  {$set : {'notifications.$.notification' : 0}})
        const channelNotifReset = await ChannelModel.findById(channelID);
        res.send(channelNotifReset)
    }

}

 
