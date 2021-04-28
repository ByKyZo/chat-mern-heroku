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
        channel : {
            type : [String]
        },  
        picture : {
            type : String,
            default : 'default picture'
        },
        role : {
            type : String,
            default : 'user'
        }
    },
    {
        timestamps : true
    }
)


export default mongoose.model('user', UserSchema);