import express from "express"
import connectDB from "./database/connection.database.js";
import productRoutes from "./routes/product.routes.js"; 
import errorHandler from "./middleware/errorHandler.middleware.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cors from "cors"

const app = express();

const PORT=process.env.PORT || 8000;

app.use(cors({credentials:true}))
app.use(express.urlencoded({
    extented:true,
}))
app.use(express.json())


connectDB().then(()=>{
     console.log(`db has connected and now running `)
    app.listen(PORT,()=>{
    console.log('server is running on',PORT)
})
}).catch((err)=>{
    console.log(`db connection has some error.${err}`)
})



app.get('/',(req,res)=>{
    res.json({
        message:"server is running for e-commerce platform",
    })
})

app.use('/products',productRoutes)
app.use('/user',userRoutes)
app.use('/orders',orderRoutes)




app.use((req,res)=>{
        console.log('404 error')
        res.status(404).json({message:'page was not found.'})
    })



app.use(errorHandler);
