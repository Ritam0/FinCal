const authorizeRoles =(role)=>{
    return(req,res,next)=>{
        if(role!=req.user.role){
            return res.status(403).json({message:"acces denied"});
        }
        next();
    }
}
module.exports= authorizeRoles;