import mongoose from "mongoose";



const productSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number , required: true, trim: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    {
        timestamps: true
    })

const Product = mongoose.model('Product', productSchema);

export default Product;