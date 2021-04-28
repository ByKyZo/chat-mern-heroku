import mongoose, { Schema } from 'mongoose';

const ChannelSchema = new Schema (
    {
        name : {
            type : String,
            max : 20,
            required : true
        },
        description : {
            type : String,
        },
        owner : {
            type : String
        },
        coOwner : {
            type : [String]
        },
        notification : [
            {
                userID : {
                    type : String,
                },
                notification : {
                    type : Number,
                    default : 0,
                }
            }
        ]
    },
    {
        timestamps : true
    }
)

export default mongoose.model('channel',ChannelSchema);