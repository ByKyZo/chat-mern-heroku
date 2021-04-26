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
const message_model_1 = __importDefault(require("../models/message.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
class MessageController {
    // FORMATER LA DATE
    // ESSAYER DE LE FAIRE A LA CREATION DU MESSAGE
    static sendMessage(userID, channelID, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userID).select('-channel -password -email -remember_me_token');
            const messageSend = yield message_model_1.default.create({ user, channelID, message });
            // messageSend = await JSON.parse(JSON.stringify(messageSend));
            // console.log(messageSend)
            // messageSend.createdAt = await messageSend.createdAt.replaceAll('-','/');
            return messageSend;
            // await MessageModel.deleteMany({});
        });
    }
    static deleteMessage(req, res) {
    }
}
exports.default = MessageController;
