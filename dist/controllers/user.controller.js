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
const user_model_1 = __importDefault(require("../models/user.model"));
const channel_model_1 = __importDefault(require("../models/channel.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const stream_1 = require("stream");
class UserController {
    static leaveChannel(userID, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            channel_model_1.default.findByIdAndUpdate(channelID, { $pull: { notifications: { userID } } }, (err, docs) => docs.save());
            const user = yield user_model_1.default.findByIdAndUpdate(userID, { $pull: { channel: channelID } });
            return user;
        });
    }
    static uploadProfilPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pseudo, userID } = req.body;
            const file = req.file;
            const pipelinee = util_1.promisify(stream_1.pipeline);
            if (file.detectedMimeType !== 'image/png' &&
                file.detectedMimeType !== 'image/jpg' &&
                file.detectedMimeType !== 'image/jpeg')
                return console.log('EROROROOROR');
            const pictureName = `${pseudo}${Math.round(Math.random() * 1000)}${Date.now()}.png`;
            const uploadFilePath = `${__dirname}/../assets/images/${pictureName}`;
            const urlPicturePath = `profilepicture/images/${pictureName}`;
            yield pipelinee(file.stream, fs_1.default.createWriteStream(uploadFilePath));
            user_model_1.default.findByIdAndUpdate(userID, { $set: { picture: urlPicturePath } }, (err, docs) => {
                const oldPicture = docs.picture.substring(22);
                const removeFilePath = `${__dirname}/../assets/images/${oldPicture}`;
                fs_1.default.unlink(removeFilePath, (err) => {
                    if (err)
                        return console.log('error file not deleted');
                    console.log('file was deleted');
                });
                res.send(urlPicturePath);
            });
            message_model_1.default.updateMany({ 'user._id': userID }, { $set: { user: { picture: urlPicturePath } } });
            // SUPPRIMER L'IMAGE
        });
    }
}
exports.default = UserController;
UserController.getUser = (req, res) => {
    res.send('get user');
};
