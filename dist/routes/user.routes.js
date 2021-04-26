"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.default.Router();
// AUTH
router.post('/signup', auth_controller_1.default.signUp);
router.post('/signin', auth_controller_1.default.signIn);
router.get('/rememberme', auth_controller_1.default.rememberMe);
router.post('/channel/leave', user_controller_1.default.leaveChannel);
module.exports = router;
