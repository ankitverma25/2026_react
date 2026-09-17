import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, updatedProduct } from '../controllers/product.controllers.js';
import authHandler from '../middleware/authHandler.middleware.js';
import isAdminHandler from '../middleware/isAdminHandler.middleware.js';




const router=express.Router();


router.get('/',authHandler,getAllProducts);
router.get('/:id',authHandler, getProductById);
router.post('/',authHandler,isAdminHandler,createProduct);
router.delete('/:id',authHandler,isAdminHandler,deleteProduct);
router.put('/:id',authHandler,isAdminHandler,updatedProduct);


export default router;