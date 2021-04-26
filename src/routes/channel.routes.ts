import express from 'express';
import ChannelController from '../controllers/channel.controller';


const router = express.Router();

router.get('/:id',ChannelController.getAllChannelByUserId);
router.get('/search/:id',ChannelController.getAllChannelByNotMatchUserID);
router.get('/message/:id',ChannelController.getChannelMessage);
router.get('/user/:id',ChannelController.getUsersChannel);
router.post('/ban',ChannelController.banChannelMember);







export = router; 