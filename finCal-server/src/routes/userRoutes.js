const express=require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles=require("../middlewares/roleMiddleware");
const router=express.Router();

router.get("/admin",verifyToken,authorizeRoles("admin"),(req,res)=>{
    res.json({message:`welcome admin`});
})
router.get("/manager",verifyToken,authorizeRoles("manager"),(req,res)=>{
    res.json({message:`welcome manager`});
})
router.get("/user",verifyToken,authorizeRoles("user"),(req,res)=>{
    res.json({message:`welcome user`});
})

module.exports=router;