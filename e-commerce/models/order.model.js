import mongoose from "mongoose";
// import User from "./user.model.js";
// import Product from "./product.model.js";



const orderSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },


    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    }

}, {
    timestamps: true,
});


const OrderModel = mongoose.model('OrderModel', orderSchema)

export default OrderModel