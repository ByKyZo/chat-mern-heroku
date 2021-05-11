import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema (
    {
        userID : {
            type : String,
        },
        notification : {
            type : Number,
            default : 0,
        }
    }
)
export default mongoose.model('notification',NotificationSchema);