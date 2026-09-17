

const errorHandler= (err,req,res,next)=>{
    console.log('error is coming from errorHandler middleware',err.stack)
    const statuscode =err.status || 500;
    const message = err.message || "internal server error";
    res.status(statuscode).json({
        message:message,
        statuscode:statuscode
    })

}
 
export default errorHandler