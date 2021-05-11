import express from 'express';
import UserController  from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import multer from 'multer';

const upload = multer();
const router = express.Router();

// AUTH
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.get('/rememberme', AuthController.rememberMe);
router.post('/uploadprofilpicture', upload.single('picture') ,UserController.uploadProfilPicture)
// router.post('/channel/leave',UserController.leaveChannel);


// USER
// router.post('/sendmessage', MessageController.sendMessage);




export = router;

