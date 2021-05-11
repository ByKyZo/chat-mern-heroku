"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const multer_1 = __importDefault(require("multer"));
const upload = multer_1.default();
const router = express_1.default.Router();
// AUTH
router.post('/signup', auth_controller_1.default.signUp);
router.post('/signin', auth_controller_1.default.signIn);
router.get('/rememberme', auth_controller_1.default.rememberMe);
router.post('/uploadprofilpicture', upload.single('picture'), user_controller_1.default.uploadProfilPicture);
module.exports = router;
