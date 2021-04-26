import mongoose, { Schema } from 'mongoose';

// const date: String = new Date().toString().replace('-','/');


const MessageShema: Schema = new Schema (
    {
        user : {
            type : Object,
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
    // this.date = '24/04/2021';
    this.hour = new Date().toLocaleTimeString().substring(0,5)

    next();
})

export default mongoose.model('message',MessageShema);