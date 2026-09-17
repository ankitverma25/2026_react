import OrderModel from "../models/order.model.js";
import Product from "../models/product.model.js";


export const createOrder = async (req, res, next) => {
    try {

        const { products } = req.body;
        let totalPrices = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                const error = new Error('No product with this id.')
                error.status = 404;
                throw error;
            }
            totalPrices = totalPrices + (product.price * item.quantity);

            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
            })
        }

        const order = await OrderModel.create({
            user: req.user.id,
            products: orderProducts,
            totalPrice: totalPrices,
        })

        res.status(200).json({
            message: 'order created sucessfully.',
            order: order,
        })





    }

    catch (error) {

        next(error)

    }

}

export const getAllOrders = async (req, res, next) => {




}