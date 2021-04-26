import mongoose, { Schema } from 'mongoose';
// import { isEmail } from 'validator';
// import isEmail from 'validator/lib/isEmail';

const UserSchema: Schema = new Schema (

    {
        pseudo : {
            type : String,
            min : 4,
            max : 30,
            required : true
        },
        email : {
            type : String,
            required : true,
            lowercase : true
            // validation : [isEmail]
        },
        password : {
            type : String,
            required : true
        },
        remember_me_token : {
            type : String
        },
        picture : {
            type : String,
            default : 'default picture'
        },
        channel : {
            type : [String]
        },
    },
    {
        timestamps : true
    }
)


export default mongoose.model('user', UserSchema);