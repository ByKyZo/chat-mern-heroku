import mongoose, { Schema } from 'mongoose';

const MessageShema: Schema = new Schema (
    {
        userID : {
            type : String,
            required : true
        },
        channelID : {
            type : String,
            required : true
        },
        message : {
            type : String
        },
        date : {
            type : String,
        },
        hour : {
            type : String,
        }
    },
)

MessageShema.pre('save', function(next){

    this.date = new Date().toLocaleDateString();
    // this.date = '26/04/2021';
    this.hour = new Date().toLocaleTimeString().substring(0,5)

    next();
})

export default mongoose.model('message',MessageShema);