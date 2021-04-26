"use strict";
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
const channel_model_1 = __importDefault(require("../models/channel.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
class ChannelController {
    static createChannel(userID, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield channel_model_1.default.create({ name, description, owner: userID });
            const user = yield user_model_1.default.findByIdAndUpdate(userID, { $addToSet: { channel: channel._id } }, { new: true });
            return channel;
            // await ChannelModel.deleteMany({})
        });
    }
    static getAllChannelByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.params.id;
            const user = yield user_model_1.default.findById(userID);
            if (!user || user.channel.length === 0)
                return res.status(500).send('');
            const channels = yield channel_model_1.default.find({ _id: { $in: user.channel } });
            res.status(200).send(channels);
        });
    }
    static getChannelMessage(req, res) {
        const channelID = req.params.id;
        message_model_1.default.find({}, (err, docs) => {
            if (err)
                return res.status(500).send('Channel message Error : ' + err);
            res.status(200).send(docs);
        });
    }
    static getAllChannelByNotMatchUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.params.id;
            const user = yield user_model_1.default.findById(userID);
            const channels = yield channel_model_1.default.find({ _id: { $nin: user.channel } });
            res.status(200).send(channels);
        });
    }
    static joinChannel(userID, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            const joinedUser = yield user_model_1.default.findByIdAndUpdate(userID, { $addToSet: { channel: channelID } }, { new: true }).select('-password -email -channel -remember_me_token');
            const joinedChannel = yield channel_model_1.default.findById(channelID);
            return { joinedChannel, joinedUser };
        });
    }
    static getUsersChannel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelID = req.params.id;
            const user = yield user_model_1.default.find({ channel: channelID }).select('-password -email -channel -remember_me_token');
            res.status(200).send(user);
        });
    }
    static banChannelMember(bannedUserID, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            const bannedMember = yield user_model_1.default.findByIdAndUpdate(bannedUserID, { $pull: { channel: channelID } });
            return bannedMember;
        });
    }
}
exports.default = ChannelController;
