 import jwt from "jsonwebtoken";
 const isAuth=async (req,res,next) => {
    try {
        const token = req.cookies.token;
        // console.log("Token in isAuth middleware:", token);
        if (!token) {
            return res.status(401).json({ message: " token not found" });
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodeToken){
            return res.status(401).json({ message: "Invalid token" });
        }
        req.userId = decodeToken.userId;
        req.role = decodeToken.role;
        next();
    } catch (error) {
        return res.status(500).json(`Auth middleware error ${error}`);  
    }
 }
 export default isAuth;