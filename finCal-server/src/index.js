const express=require("express");
const dotenv=require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const app=express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
dbConnect();

//Middleware
app.use(express.json());


//routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

//Start the server
const PORT=process.env.PORT || 7002;
app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
})

