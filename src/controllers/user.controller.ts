import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import ChannelModel from '../models/channel.model';
import MessageModel from '../models/message.model';
import fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';

export default class UserController {

    public static getUser = (req: Request, res: Response) => {

        res.send('get user');
    }

    public static async leaveChannel(userID: String, channelID: String) {

        ChannelModel.findByIdAndUpdate(channelID, { $pull: { notifications: { userID } } }, (err: any, docs: any) => docs.save())

        const user = await UserModel.findByIdAndUpdate(userID, { $pull: { channel: channelID } })

        return user;
    }

    public static async uploadProfilPicture(req: Request, res: Response) {

        const { pseudo , userID } = req.body;
        const file = (req as any).file;
        const pipelinee = promisify(pipeline)

        if (file.detectedMimeType !== 'image/png' && 
            file.detectedMimeType !== 'image/jpg' && 
            file.detectedMimeType !== 'image/jpeg') return console.log('EROROROOROR');
        

        const pictureName = `${pseudo}${Math.round(Math.random()*1000)}${Date.now()}.png`    
        const uploadFilePath = `${__dirname}/../assets/images/${pictureName}`;
        const urlPicturePath = `profilepicture/images/${pictureName}`;

        await pipelinee(file.stream , fs.createWriteStream(uploadFilePath))

        UserModel.findByIdAndUpdate(userID, {$set : { picture :  urlPicturePath} }, 
        (err: any , docs: any) => {
            const oldPicture = docs.picture.substring(22);
            const removeFilePath = `${__dirname}/../assets/images/${oldPicture}`
            fs.unlink(removeFilePath, (err) => {
                if (err) return console.log('error file not deleted');
                console.log('file was deleted')
            })
            res.send(urlPicturePath)
        })
        MessageModel.updateMany({'user._id' : userID}, { $set : {user : { picture : urlPicturePath} } })

        // SUPPRIMER L'IMAGE
    }
}
