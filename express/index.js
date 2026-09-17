require('dotenv').config();
const mongoose =require('mongoose')
const Product=require('./models/product.model')


const express=require('express');
const app=express();


app.use(express.json());

const PORT= process.env.PORT


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("database sucessfully connected")

}
).catch((err)=>{console.log('connection failed',err)
}
)


const products = [
  { id: 1, name: "Shoes", category: "footwear" },
  { id: 2, name: "Shirt", category: "clothing" },
  { id: 4, name: "Pant", category: "clothing" },
  { id: 3, name: "Watch", category: "accessories" },
];


app.use((req,res,next)=>{
    console.log(`${req.url} and ${req.method}`)
    next();
})
app.use((req,res,next)=>{
    console.log(new Date().toLocaleTimeString( ))
    next();
})



app.get('/',(req,res)=>{

    res.send('server is running'); 
}    
)



// app.post('/products',(req,res)=>{
//     const product=req.body;
//     if(!product.id || !product.name || !product.category){
//         return res.status(400).send('id,name and category are required');
//     }
//     console.log(product);
//     products.push(product);
//     res.status(201).json(product)
// })
app.post('/products',async(req,res,next)=>{
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct)

    } catch (err) {
        next(err)
    }

})

app.put('/products/:id',async(req,res,next)=>{
    try {
        const productId=req.params.id;
        const data=req.body;
        const updatedProduct= await Product.findByIdAndUpdate(productId,data,{new:true})
        if(!updatedProduct){
            const error= new Error('product was not there.')
            error.status=404;
            throw error

        }
        res.json({message: "Product deleted successfully", 
    deletedProduct: updatedProduct })
        
    } catch (error) {
        next(error)
        
    }
})

// app.put('/products/:id',(req,res)=>{
//     const id=req.params.id;
//     const data=req.body;

//     const findbyid = products.findIndex((p)=> p.id == id);
//     if(findbyid==-1){
//         return res.status(404).send('Product was not found.')
//     }
//     const product=products[findbyid]

//     product.category=data.category;
//     product.name=data.name

//     res.json(product)
    

// })


// app.delete('/products/:id',(req,res)=>{
//     const id = req.params.id;
//     const findById = products.findIndex((p)=>p.id==id);
    
//     if(findById == -1){
//         return res.status(404).send('Product was not there.');
//     }
//     const deletedItem = products.splice(findById,1) 
//     console.log(deletedItem)
//     res.json({ message: "Product deleted successfully", deletedItem: deletedItem[0]});

// })

app.delete('/products/:id',async(req,res,next)=>{
    try {
        const productId=req.params.id;
        const deleteProduct=await Product.findByIdAndDelete(productId);
        if(!deleteProduct){
            const error= new Error('product was not there')
            error.status=404;
            throw error
        }
        res.json({message: "Product deleted successfully", 
    deletedProduct: deleteProduct} )
        
    } catch (error) {
     next(error)

        
    }
})



// app.get('/products/:id',(req,res)=>{
//     const id=parseInt(req.params.id);
//     const params=req.params;
//     console.log(params);
//     const product=products.find((product)=>id==product.id);

//     product?res.json(product):res.status(404).send('product not found');
//     console.log(product);

// })
app.get('/products/:id',async(req,res,next)=>{
    try {
        const id =req.params.id;
        const product= await Product.findById(id);
        if(!product){
            const error= new Error('There is no product available with this id.')
            error.status=404
            throw error;
        }
        res.json(product)
        
    } catch (error) {
        next(error)  
    }
})

// app.get('/products/:id',(req,res,next)=>{
//     try {
//         const productId = req.params.id;
//         const product = products.find((p)=>p.id==productId);
//         if(!product){
//             const error= new Error('There is no product available with this id.')
//             error.status=404
//             throw error;          
//         }
//         res.json(product)

        
//     } catch (error) {
//         next(error)
        
//     }

// })

// app.get('/products',(req,res)=>{
//     const category=req.query.category;
//     console.log(category)
//     const filterProduct=products.filter((p)=>p.category==category)
//     console.log(filterProduct)
//     filterProduct.length>0?res.json(filterProduct):res.json(products)
// })
app.get('/products',async(req,res,next)=>{
    try {
        const category =req.query.category;

        const products = (!category) ? await Product.find() : await Product.find({category:category})

        res.status(200).json(products);
        
    } catch (error) {
        next(error)
        
    }

})



app.use((req,res)=>{
    res.status(404).send('Route not found')
})

app.use((err,req,res,next)=>{
    console.log(err.stack);
    const status=err.status || 500 ;
    res.status(status).send({
        'message':err.message || 'Internal server error',
    })

})


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})