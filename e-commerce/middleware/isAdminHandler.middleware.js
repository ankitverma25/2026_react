
const isAdminHandler = async (req,res,next) => {
    try {

        const userRole = req.user.role;
        if(userRole!=='admin'){
            const error= new Error('Admin was not there.')
            error.status= 403;
            throw error

        }
       next()


    } catch (error) {
        next(error)
        
    }
    
}

export default isAdminHandler