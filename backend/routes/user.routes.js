import express from "express";
import isAuth from "../middleware/isAuth.js";
import getCurrentUser, { changeUserRole, createUser, deleteUser, editUserNameAndPassword, getManagers, getUsers } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/get-manager", isAuth,  getManagers);
userRouter.get("/get-user", isAuth,getUsers);
userRouter.delete("/delete/:id", isAuth, deleteUser);
userRouter.put("/edit-username-password", isAuth, editUserNameAndPassword);
userRouter.put("/change-role/:id", isAuth, changeUserRole);
userRouter.post("/create", isAuth, createUser);

export default userRouter;
