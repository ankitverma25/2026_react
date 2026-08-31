
app.get('/products/:id',(req,res)=>{
    coonsole.log(req.params.id)

})

app.listen(PORT,(req,res)=>{
    console.log(`server is running on ${PORT}`)
})