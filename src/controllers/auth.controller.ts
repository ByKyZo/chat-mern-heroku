import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import  UserModel  from '../models/user.model';

export default class AuthController {

    // private static createToken (userID: String) {
    //       UserModel.findByIdAndUpdate(
    //                 userID, 
    //                 {
    //                     $set : {
    //                         remember_me_token : uuidv4()
    //                     }
    //                 },
    //                 (err , docs) => {
    //                     return err ? err : docs;
    //                 }
    //             )
    // }

    public static async signUp (req: Request, res: Response) {
        
        const {pseudo , email , password} = req.body;
        const emailAlreadyExist = await UserModel.findOne({email});
  
        if (emailAlreadyExist) return res.status(500).send('Error email already exist');

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const user = await UserModel.create(
            {
                pseudo,
                email,
                password : passwordHash
            },
            (err , docs) => {
                if (err) return res.status(500).send('SignUp error : ' + err);
                res.status(200).send(docs);
            }
        )
    }

    public static async signIn (req: Request , res: Response) {

        const {email , password} = req.body;
        const user = await UserModel.findOne({email});

        if (!user) return res.status(401).send('Emain doesn\'t exist');

        bcrypt.compare(password,user.password, async (err: any , same: any) => {
            if (!same) return res.status(401).send('Wrong password');

            UserModel.findByIdAndUpdate(
                user._id, 
                {
                    $set : {
                        remember_me_token : uuidv4()
                    },
                },
                {
                    new : true
                },
                (err , docs) => {
                    if (err) return res.status(500).send('TOKEN ERROR');
                    res.send(docs);
                }
            )
        }) 
    }

    public static async rememberMe (req: Request , res: Response) {
        const rememberMeToken = req.cookies.REMEMBER_ME;

        UserModel.findOneAndUpdate(
            {remember_me_token : rememberMeToken},
            {
                $set : {
                    remember_me_token : uuidv4()
                }, 
            },
            {new : true},
            (err , docs) => {
                if (err) return res.status(500).send('TOKEN ERROR');
                res.send(docs);
            }
        )
    }
}