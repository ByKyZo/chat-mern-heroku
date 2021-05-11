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
            const channel = yield channel_model_1.default.create({ name, description, owner: userID, notifications: { userID } });
            const user = yield user_model_1.default.findByIdAndUpdate(userID, { $addToSet: { channel: channel._id } }, { new: true });
            return channel;
            // await ChannelModel.deleteMany({})
        });
    }
    static getAllChannelByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.params.id;
            const user = yield user_model_1.default.findById(userID, (err, docs) => __awaiter(this, void 0, void 0, function* () {
                const user = docs.toObject();
                if (!user || user.channel.length === 0)
                    return res.status(500).send('');
                const channels = yield channel_model_1.default.find({ _id: { $in: user.channel } });
                res.status(200).send(channels);
            }));
        });
    }
    static getChannelMessage(req, res) {
        const channelID = req.params.id;
        message_model_1.default.find({}, (err, docs) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.status(500).send('Channel message Error : ' + err);
            const messages = docs.map((doc) => doc.toObject());
            for (let i = 0; i < messages.length; i++) {
                const user = yield user_model_1.default.findById(messages[i].userID).select('-channel -password -email -remember_me_token');
                messages[i].user = user;
            }
            res.status(200).send(messages);
        }));
    }
    static getAllChannelByNotMatchUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.params.id;
            user_model_1.default.findById(userID, (err, docs) => __awaiter(this, void 0, void 0, function* () {
                const user = docs.toObject();
                const channels = yield channel_model_1.default.find({ _id: { $nin: user.channel } });
                res.status(200).send(channels);
            }));
        });
    }
    static joinChannel(userID, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            const joinedUser = yield user_model_1.default.findByIdAndUpdate(userID, { $addToSet: { channel: channelID } }, { new: true }).select('-password -email -channel -remember_me_token');
            const joinedChannel = yield channel_model_1.default.findByIdAndUpdate(channelID, { $addToSet: { notifications: { userID } } }, { new: true }); // peut etre new : true
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
            channel_model_1.default.findByIdAndUpdate(channelID, { $pull: { notifications: { userID: bannedUserID } } }, (err, docs) => docs.save());
            return bannedMember;
        });
    }
    static deleteChannel(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.updateMany({ $pull: { channel: channelID } });
            return yield channel_model_1.default.findByIdAndDelete(channelID);
        });
    }
    static channelNotification(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            // TROUVER POURQUOI 9A sincremente pas
            // find and update
            const channelNotifiedUpdated = yield channel_model_1.default.updateMany({ _id: channelID }, { $inc: { 'notifications.$[].notification': 1 } });
            const channelNotified = yield channel_model_1.default.findById(channelID);
            return channelNotified;
        });
    }
    static resetNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID, channelID } = req.body;
            const channel = yield channel_model_1.default.updateOne({ _id: channelID, notifications: { $elemMatch: { userID: userID } } }, { $set: { 'notifications.$.notification': 0 } });
            const channelNotifReset = yield channel_model_1.default.findById(channelID);
            res.send(channelNotifReset);
        });
    }
}
exports.default = ChannelController;
