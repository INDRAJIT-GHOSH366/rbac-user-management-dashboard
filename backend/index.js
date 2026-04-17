import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";




const app=express();
const port=process.env.PORT || 5000;
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true 
    }
))
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
// app.use("/api/shop",shopRouter);
// app.use("/api/item",itemRouter);
// app.use("/api/order", orderRouter);



app.listen(port,()=>{
    connectDb();
    console.log(`Server Started at ${port}`);
    console.log("THIS IS MY REAL SERVER FILE ✅");
    // console.log("shopRouter type =>", typeof shopRouter);
    

});
