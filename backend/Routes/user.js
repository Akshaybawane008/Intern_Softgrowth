import express from "express";
import { registerUser, loginUser,getAllUser, getUserById, deleteUserById,updateUserById} from "../controller/User.js";

const router = express.Router()
// routes
// api/users/

// registering user
router.post("/register",registerUser);
// login user
router.post("/login",loginUser)

// get all users details
router.get("/",getAllUser)

// get user details by  id
router.get("/:id",getUserById)
// update user details
router.put("/:id",updateUserById)
// delete user details
router.delete("/:id",deleteUserById)

export default router