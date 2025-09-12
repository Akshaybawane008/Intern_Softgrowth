import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Generate random password with name prefix
function makeRandomPassword(firstName) {
    const randomStr = crypto.randomBytes(3).toString("hex"); // 6-char random
    return `${firstName}${randomStr}`;
}

// routes
// post method
// /api/user/register

export const registerUser = async (req, res) => {
    const {
        //      name: "",
        // middleName: "",
        // lastName: "",
        // mobile: "",
        // email: "",
        // dob: "",
        // college: "",
        // durationStart: "",
        // durationEnd: "",
        // address: "",
        // aadhar: "",
        name,
        middleName,
        lastName,
        mobile,
        email,
        dob,
        college,
        durationStart,
        durationEnd,
        address,
        aadhar,

    } = req.body;

    // Validation
    if (
        !name || !middleName || !lastName ||
        !mobile || !email || !dob ||
        !college || !durationStart || !durationEnd ||
        !address || !aadhar
    ) return res.status(400).json({ message: "All fields are required", success: "false" });


    let checkuser = await User.findOne({
        $or: [
            { mobile: mobile },
            { aadhar: aadhar },
            { email: email }
        ]
    });

    if (checkuser) return res.json({ message: "user already exists", success: "false" })


    try {

        // 1. Generate password
        const password = makeRandomPassword(name);

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Save user with hashed password
        const user = await User.create({
            name,
            middleName,
            lastName,
            mobile,
            email,
            dob,
            college,
            durationStart,
            durationEnd,
            address,
            aadhar,
            password: hashedPassword
        });


        // 4. Setup email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jrsahil24@gmail.com",   // sender email
                pass: "wuzl acxt mgdo hxaz "        // Gmail App Password (not real password!)
            }
        });

        // 5. Send email to the registered intern
        const mailOptions = {
            from: "jrsahil24@gmail.com",
            to: email,  // <-- dynamic: intern's registered email
            subject: "Your Internship Account Credentials",
            text: `Hello ${name},\n\nYour internship account has been created successfully.\n\nUsername: ${email}\nPassword: ${password}\n\nPlease login and change your password immediately.`


        };

        await transporter.sendMail(mailOptions);

        // 6. Response (do not send password here)
        res.status(201).json({
            message: "User created successfully and credentials sent to email",
            success: true,
            user: user
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

//routes
//get method 
// api/user/
export const getAllUser = async (req, res) => {
    let users = await User.find()


    if (!users) return res.json({ message: "no users exist", success: "false" })
    res.json(users)
}


// update user by id
// routes
// api/users/:id
export const updateUserById = async (req, res) => {
    let id = req.params.id
    let user = await User.findByIdAndUpdate(id, req.body, { new: true })

    if (!user) return res.json({ message: "no user exist", success: "false" })
    res.json({ message: "user updated successfully", user, success: true })
}

// delete user by id
// routes
// api/users/:id

export const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {

            return res.status(404).json({ message: "User not found" });

        }

        res.json({ message: "User deleted successfully" });

    } catch (error) {

        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });

    }
};

         

// Routes
// post method
// /api/user/login
export const loginUser = async (req, res) => {
  console.log(req.body);
    let { email, password } = req.body;

    if (!email || !password) return res.json({ message: "email and password required", success: "false" })
    let user = await User.findOne({ email })
    if (!user) return res.json({ message: "user doesnot exist", success: false })

    let valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.json({ message: "invalid password", success: false })
    let token = jwt.sign({ user: user._id }, "$%%^%#$#", {
        expiresIn: "1d"
    })
    res.json({ message: `hello ${user.name} you successfully log in`, success: true, token, role: user.role })



}



//routes
//get
// api/users/profile/me
export const getuserprofile = async (req,res)=>{
    
    // console.log("getting id from token =",req.user)
    let user = await User.findById(req.user)
    if(!user) return res.json({message:"no user exist", success:"false"})
    res.json({message:"user profile fetched successfully", user, success:true})
}

// get user by id
// routes
// api/users/:id
export const getUserById = async (req, res) => {
    let id = req.params.id
    console.log(id)

    let user = await User.findById(id)
    // console.log(user)

    if (!user) return res.json({ message: "no user exist", success: "false" })
    res.json({ message: "user found successfully", user, success: true })
}
