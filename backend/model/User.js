import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String, required: true },
    last_name: { type: String, required: true },
    mobile_no: { type: Number, required: true, unique: true },
    email_id: { type: String, required: true, unique: true },
    date_of_birth: { type: Date, required: true },
    collage_name: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    address: { type: String, required: true },
    adhar_no: { type: Number, required: true, unique: true },
    password :{ type: String, required: true }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

export const User = mongoose.model("User", userSchema);