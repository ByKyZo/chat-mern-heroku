"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const channel_controller_1 = __importDefault(require("../controllers/channel.controller"));
const router = express_1.default.Router();
router.get('/:id', channel_controller_1.default.getAllChannelByUserId);
router.get('/search/:id', channel_controller_1.default.getAllChannelByNotMatchUserID);
router.get('/message/:id', channel_controller_1.default.getChannelMessage);
router.get('/user/:id', channel_controller_1.default.getUsersChannel);
router.post('/ban', channel_controller_1.default.banChannelMember);
module.exports = router;
