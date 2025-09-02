import { User } from "../model/UserModels.js";

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
    adhar_no,
  } = req.body;

  // Validation
  if (
    !first_name || !middle_name || !last_name ||
    !mobile_no || !email_id || !date_of_birth ||
    !collage_name || !start_date || !end_date ||
    !address || !adhar_no
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    // Save user directly to DB
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
    });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
