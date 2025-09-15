import express from "express";
import { registerUser, loginUser,getAllUser, getUserById, deleteUserById,updateUserById,getuserprofile} from "../controller/User.js";
import { isauthenticated } from "../middelware/Auth.js";

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
router.get("/:id",isauthenticated,getUserById)
// update user details
router.put("/:id",isauthenticated,updateUserById)
// delete user details
router.delete("/:id",isauthenticated,deleteUserById)

// get user profile

router.get("/profile/me",isauthenticated,getuserprofile)

export default router