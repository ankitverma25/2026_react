import express from 'express'
import authHandler from '../middleware/authHandler.middleware.js';
import { createOrder } from '../controllers/order.controllers.js';



const router=express.Router();


router.post('/',authHandler,createOrder);


export default router;

