import express from "express";
import { registerUser, loginUser,getAllUser,updateUser, userDelete} from "../controller/User.js";

const router = express.Router()

router.post("/register",registerUser);
router.post("/login",loginUser)

router.get("/",getAllUser);
router.put("/:id",updateUser);
router.delete("/:id",userDelete);

export default router