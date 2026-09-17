import express from 'express'
import { getMyProfile, loginUser, registerUser } from "../controllers/user.controllers.js";
import authHandler from '../middleware/authHandler.middleware.js';

const router=express.Router();




router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',authHandler,getMyProfile)


export default router;