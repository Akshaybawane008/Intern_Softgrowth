import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    // frontend form fields
    //  name: "",
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
    name: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    college: { type: String, required: true },
    durationStart: { type: Date, required: true },
    durationEnd: { type: Date, required: true },
    address: { type: String, required: true },
    aadhar: { type: Number, required: true, unique: true },
    password :{ type: String, required: true }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

export const User = mongoose.model("User", userSchema);