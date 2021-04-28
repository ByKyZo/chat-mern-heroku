import express from 'express';
import { createServer } from 'http';
import * as dotenv from 'dotenv';
dotenv.config({path : './env/.env'});
import bodyParser from 'body-parser';
import './config/dbconfig';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes';
import channelRouter from './routes/channel.routes';
import { Server, Socket } from 'socket.io';
import MessageController from './controllers/message.controller';
import ChannelController from './controllers/channel.controller';
import path from 'path';
import UserController from './controllers/user.controller';

const server = express();
const httpServer = createServer(server);
const PORT = process.env.PORT || 5050;

// const io = new Server(httpServer, { // A COMMENTER POUR LA PRODUCTION
//     cors : {
//         origin : 'http://localhost:3000'
//     }
// });
/**
 * A DECOMMENTER POUR LA PRODUCTION
 */

const io = new Server(httpServer);


// socket io
io.on("connection", (socket: Socket) => {
    console.log('User connected ' + socket.id);

    socket.on('sendMessage',async (mess: any) => {
        const message = await MessageController.sendMessage(mess.userID , mess.channelID , mess.message);
        io.emit('sendMessage', message);
    })

    socket.on('createChannel',async ({userID , name , description}) => {
        const channel = await ChannelController.createChannel(userID , name , description);
        io.emit('createChannel',{ userID , channel });
    })

    socket.on('joinChannel', async ({ userID , channelID }) => {
        const { joinedChannel , joinedUser } = await ChannelController.joinChannel(userID , channelID);
        io.emit('joinChannel',{ joinedUser , joinedChannel });
    })
    socket.on('banMember', async ({ bannedMemberID , channelID }) => {
        const bannedMember = await ChannelController.banChannelMember(bannedMemberID , channelID)
        io.emit('banMember',{ bannedMember , channelID })
    })
    socket.on('deleteChannel', async (channelID: String) => {
        const deletedChannel = await ChannelController.deleteChannel(channelID);
        io.emit('deleteChannel', deletedChannel);
    })
    socket.on('leaveChannel', async ({ userID , channelID }) => {
        const leaveMember = await UserController.leaveChannel(userID , channelID);
        io.emit('leaveChannel',{ leaveMember , channelID })
    })
    // socket.on('channelNotification', async ({ userID , channelID }) => {
    //     const channelNotifiedbyUserID = await ChannelController.notification(userID , channelID);
    //     socket.emit('channelNotification',({ userID , channelID }))
    // })
});


// middleware
server.use(bodyParser.json());
// server.use(cors({ origin : 'http://localhost:3000',credentials : true})); // A COMMENTER POUR LA PRODUCTION
server.use(cookieParser());

// routes
server.use('/user',userRouter);
server.use('/channel',channelRouter);

/**
 * A DECOMMENTER POUR LA PRODUCTION
 */

server.use(express.static(path.join(__dirname , '../client/build')));
server.get('/*', ( _, res) => {
    res.sendFile(path.join(__dirname , '../client/build/index.html'));
})


httpServer.listen(PORT , () => {
    console.log('Connected on PORTT : ' + PORT);
});


