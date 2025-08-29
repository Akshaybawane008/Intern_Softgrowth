import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Generate random password with first_name prefix
function makeRandomPassword(firstName) {
    const randomStr = crypto.randomBytes(3).toString("hex"); // 6-char random
    return `${firstName}${randomStr}`;
}

// routes
// /api/user/register

export const registerUser = async (req, res) => {
    const {
        first_name,
        middle_name,
        last_name,
        mobile_no,
        email_id,
        date_of_birth,
        collage_name,
        start_date,
        end_date,
        address,
        adhar_no
    } = req.body;

    // Validation
    if (
        !first_name || !middle_name || !last_name ||
        !mobile_no || !email_id || !date_of_birth ||
        !collage_name || !start_date || !end_date ||
        !address || !adhar_no
    ) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {

        // 1. Generate password
        const password = makeRandomPassword(first_name);

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Save user with hashed password
        const user = await User.create({
            first_name,
            middle_name,
            last_name,
            mobile_no,
            email_id,
            date_of_birth,
            collage_name,
            start_date,
            end_date,
            address,
            adhar_no,
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
            to: email_id,  // <-- dynamic: intern's registered email
            subject: "Your Internship Account Credentials",
            text: `Hello ${first_name},\n\nYour internship account has been created successfully.\n\nUsername: ${email_id}\nPassword: ${password}\n\nPlease login and change your password immediately.`
        };

        await transporter.sendMail(mailOptions);

        // 6. Response (do not send password here)
        res.status(201).json({
            message: "User created successfully and credentials sent to email",
            success: true,
            user: {
                id: user._id,
                email: user.email_id,
                name: `${user.first_name} ${user.last_name}`
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


// Routes
// /api/user/login
export const loginUser = async (req, res) => {

    let { email_id, password } = req.body;
    if (!email_id || !password) return res.json({ message: "email and password required", success: "false" })
    let user = await User.findOne({ email_id })
    if (!user) return res.json({ message: "user doesnot exist", success: false })

    let valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.json({ message: "invalid password", success: false })
    let token = jwt.sign({user:user._id},"$%%^%#$#",{
expiresIn:"1d"})
    res.json({ message: `hello ${user.first_name} you successfully log in`, success: true,token })



}
