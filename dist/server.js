"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: './env/.env' });
const body_parser_1 = __importDefault(require("body-parser"));
require("./config/dbconfig");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const channel_routes_1 = __importDefault(require("./routes/channel.routes"));
const socket_io_1 = require("socket.io");
const message_controller_1 = __importDefault(require("./controllers/message.controller"));
const channel_controller_1 = __importDefault(require("./controllers/channel.controller"));
const path_1 = __importDefault(require("path"));
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const server = express_1.default();
const httpServer = http_1.createServer(server);
const PORT = process.env.PORT || 5050;
// const io = new Server(httpServer, { // A COMMENTER POUR LA PRODUCTION
//     cors : {
//         origin : 'http://localhost:3000'
//     }
// });
/**
 * A DECOMMENTER POUR LA PRODUCTION
 */
const io = new socket_io_1.Server(httpServer);
// socket io
io.on("connection", (socket) => {
    console.log('User connected ' + socket.id);
    socket.on('sendMessage', (mess) => __awaiter(void 0, void 0, void 0, function* () {
        const message = yield message_controller_1.default.sendMessage(mess.userID, mess.channelID, mess.message);
        io.emit('sendMessage', message);
    }));
    socket.on('createChannel', ({ userID, name, description }) => __awaiter(void 0, void 0, void 0, function* () {
        const channel = yield channel_controller_1.default.createChannel(userID, name, description);
        io.emit('createChannel', { userID, channel });
    }));
    socket.on('joinChannel', ({ userID, channelID }) => __awaiter(void 0, void 0, void 0, function* () {
        const { joinedChannel, joinedUser } = yield channel_controller_1.default.joinChannel(userID, channelID);
        io.emit('joinChannel', { joinedUser, joinedChannel });
    }));
    socket.on('banMember', ({ bannedMemberID, channelID }) => __awaiter(void 0, void 0, void 0, function* () {
        const bannedMember = yield channel_controller_1.default.banChannelMember(bannedMemberID, channelID);
        io.emit('banMember', { bannedMember, channelID });
    }));
    socket.on('deleteChannel', (channelID) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedChannel = yield channel_controller_1.default.deleteChannel(channelID);
        io.emit('deleteChannel', deletedChannel);
    }));
    socket.on('leaveChannel', ({ userID, channelID }) => __awaiter(void 0, void 0, void 0, function* () {
        const leaveMember = yield user_controller_1.default.leaveChannel(userID, channelID);
        io.emit('leaveChannel', { leaveMember, channelID });
    }));
    // socket.on('channelNotification', async ({ userID , channelID }) => {
    //     const channelNotifiedbyUserID = await ChannelController.notification(userID , channelID);
    //     socket.emit('channelNotification',({ userID , channelID }))
    // })
});
// middleware
server.use(body_parser_1.default.json());
// server.use(cors({ origin : 'http://localhost:3000',credentials : true})); // A COMMENTER POUR LA PRODUCTION
server.use(cookie_parser_1.default());
// routes
server.use('/user', user_routes_1.default);
server.use('/channel', channel_routes_1.default);
/**
 * A DECOMMENTER POUR LA PRODUCTION
 */
server.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
server.get('/*', (_, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/build/index.html'));
});
httpServer.listen(PORT, () => {
    console.log('Connected on PORTT : ' + PORT);
});
