import jwt from "jsonwebtoken";
import { User } from "../model/User.js";


export const isauthenticated = async (req, res, next) => {
  const token = req.header("auth"); // or "Authorization" if using Bearer tokens
  // console.log("token in auth middleware =", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded token =", decoded);

    // 👇 IMPORTANT: extract the id field
    const fetchedUser = await User.findById(decoded.user);

    if (!fetchedUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // console.log("user in auth middleware =", fetchedUser);

    // attach user object to request
    req.user = fetchedUser;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Token is not valid",
      success: false,
      error: err.message
    });
  }
};
