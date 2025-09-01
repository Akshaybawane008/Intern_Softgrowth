import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  adhar_no: { type: Number, required: true, unique: true }
}
  , { timestamps: true });

export const User = mongoose.model("User", userSchema);
