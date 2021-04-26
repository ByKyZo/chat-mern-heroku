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

const server = express();
const httpServer = createServer(server);

const io = new Server(httpServer, {
    cors : {
        origin : 'https://chat-group-master.herokuapp.com'
    }
});


// socket io
io.on("connection", (socket: Socket) => {
    console.log('User connected ' + socket.id);

    socket.on('sendMessage',async (mess: any) => {
        // console.log('message : ' + mess)
        const message = await MessageController.sendMessage(mess.userID , mess.channelID , mess.message);
        // console.log(message);
        io.emit('sendMessage', message);
    })

    socket.on('createChannel',async ({userID , name , description}) => {
        const channel = await ChannelController.createChannel(userID , name , description);
        // console.log(channel);
        io.emit('createChannel',{ userID , channel });
    })

    socket.on('joinChannel', async ({ userID , channelID }) => {

        const { joinedChannel , joinedUser } = await ChannelController.joinChannel(userID , channelID);
        console.log(joinedChannel);
        // console.log(channelID);
        io.emit('joinChannel',{ joinedUser , joinedChannel });
    })
    socket.on('banMember', async ({ bannedMemberID , channelID }) => {

        const bannedMember = await ChannelController.banChannelMember(bannedMemberID , channelID)

        io.emit('banMember',{ bannedMember , channelID })
    })
});

server.use(express.static('client/build'));
server.get('*', (req , res) => {
    res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
})

// middleware
server.use(bodyParser.json());
server.use(cors({ origin : 'https://chat-group-master.herokuapp.com',credentials : true})); // http://localhost:3000
server.use(cookieParser());


// routes
server.use('/api/user',userRouter);
server.use('/api/channel',channelRouter);


// server PORT : 5050
httpServer.listen(process.env.PORT , () => {
    console.log('Connected on PORT : ' + process.env.PORT);
});


